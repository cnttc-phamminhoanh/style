
import { SortDirection } from "common/types";
import { validateDataAccessToArray, validateDataAccessToObject } from "common/validateDataAccess";
import { Like, Repository } from "typeorm";
import { DatabaseConnection } from "../../core/database";
import { Proposals } from "./proposals.entity";
import {
  ICheckStylistSuggested,
  ICreateProposalsService,
  IDeleteProposalService,
  IFindManyProposalsResult,
  IFindManyProposalsService,
  IFindOneProposalService,
  IUpdateProposalService,
  ProposalsSortBy,
  ProposalsStatus
} from "./proposals.type";

export class ProposalsServices {
  private readonly proposalsRepository: Repository<Proposals>;

  constructor() {
    this.proposalsRepository = DatabaseConnection.dataSource.getRepository(Proposals);
  }

  async createProposal({
    data,
  }: ICreateProposalsService): Promise<Proposals> {
    try {
      const newProposal = await this.proposalsRepository.save(data);

      return newProposal;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateProposal({
    query,
    data,
    user
  }: IUpdateProposalService): Promise<boolean> {
    try {
      const proposal = await this.proposalsRepository.findOne({
        where: query
      });

      if (!proposal) {
        throw {
          code: 404,
          name: "ProposalNotFound",
        };
      }

      if (proposal?.status !== ProposalsStatus.PENDING) {
        throw {
          code: 400,
          name: `Proposal was ${proposal.status.toLowerCase()}`,
        };
      }

      validateDataAccessToObject(user, proposal);

      await this.proposalsRepository.update(
        { proposalId: proposal.proposalId },
        data
      );

      return true
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProposal({
    query,
    user
  }: IDeleteProposalService): Promise<boolean> {
    try {
      const proposal = await this.proposalsRepository.findOne({
        where: query
      })

      if (!proposal) {
        throw {
          code: 404,
          name: 'ProposalNotFound',
        }
      }

      validateDataAccessToObject(user, proposal, 'stylistId');

      if (proposal?.status === ProposalsStatus.ACCEPTED ) {
        throw {
          code: 400,
          name: 'Proposal was accepted',
        }
      }

      await this.proposalsRepository.delete({ proposalId: proposal.proposalId });

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOneProposal({
    query,
    relations = [],
    user,
  }: IFindOneProposalService): Promise<Proposals | null> {
    try {
      const proposal = await this.proposalsRepository.findOne({
        where: query,
        relations
      })

      if (!proposal) {
        throw {
          code: 404,
          name: 'ProposalNotFound'
        }
      }

      validateDataAccessToObject(user, proposal);

      return proposal
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyProposals({
    query,
    user,
    relations = [],
  }: IFindManyProposalsService): Promise<IFindManyProposalsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = ProposalsSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        message = '',
        ...newQuery
      } = query

      const [ proposals, totalCount ] = await this.proposalsRepository.findAndCount({
        where: { ...newQuery, message: Like(`%${message}%`) },
        relations,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = await validateDataAccessToArray(user, proposals) as Proposals[];

      return {
        list: validData,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
