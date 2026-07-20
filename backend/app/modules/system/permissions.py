ROLE_PERMISSIONS: dict[str, tuple[str, ...]] = {
    "admin": (
        "product.view", "product.import", "document.view", "document.upload",
        "document.reindex", "document.delete", "chat.use", "category.view",
        "category.manage", "system.configure",
    ),
    "manager": (
        "product.view", "document.view", "chat.use", "category.view",
    ),
    "employee": (
        "chat.use",
    ),
}


def permissions_for_role(role: str) -> list[str]:
    return list(ROLE_PERMISSIONS.get(role, ()))
