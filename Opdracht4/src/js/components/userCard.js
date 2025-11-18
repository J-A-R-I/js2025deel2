export function createUserCard(user) {
    const label = user.getLabel();

    return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="fw-bold">${user.name}</span>
            <span class="badge bg-secondary rounded-pill">${user.age} jaar</span>
            <small class="text-muted ms-3">${label}</small>
        </li>
    `;
}