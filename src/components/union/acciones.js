export const hasPermission = (user, permissionName) => {
    return user?.permissions?.some(p => p.name === permissionName);
}; 