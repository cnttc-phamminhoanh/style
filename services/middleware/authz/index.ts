import { RequiredRoles } from '../../common/types'
import { Permissions } from '../../modules/permissions/permissions.entity'
import { PermissionStatus, RoleName } from '../../modules/permissions/permissions.type'

const comparePermission = (requiredRoles: RequiredRoles, permission: Permissions) => {

    const result = requiredRoles.some(value => {

        if (typeof value === 'string') {
            return value === permission.roleName && permission.status === PermissionStatus.ACTIVE
        }

        if (!value.status) {
            return value.roleName === permission.roleName && permission.status === PermissionStatus.ACTIVE
        }

        if (typeof value.status === 'string') {
            return value.roleName === permission.roleName && value.status === permission.status
        }

        return value.roleName === permission.roleName && value.status.includes(permission.status)

    })

    return result

}

export const checkRole = (requiredRoles: RequiredRoles) => (event, context) => {

    if (!event?.user?.permissions || !(event.user.permissions instanceof Array)) {
        throw {
            statusCode: 401,
            name: 'UnAuthorization',
            message: `User must be authenticated`
        }
    }

    if (!requiredRoles.length) {
        event.user.isPublic = true
        return
    }

    const isAdmin = event.user.permissions.some(permission => permission.roleName === RoleName.ADMIN && permission.status === PermissionStatus.ACTIVE)

    if (isAdmin) {
        event.user.isAdmin = isAdmin
        return
    }

    const permissions = event.user.permissions.filter(permission => comparePermission(requiredRoles, permission))

    if (!permissions.length) {
        throw {
            statusCode: 403,
            name: 'Forbidden',
            message: `You don't have permission to access`
        }
    }

    event.user.permissions = permissions
}
