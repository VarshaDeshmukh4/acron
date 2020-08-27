import { writable } from 'svelte/store';

export const currentCat = writable(0);
export const loggedIn = writable(false);
export const cartProducts = writable([]);
export const currentTicket = writable(0);
export const currentTable = writable(0);
export const cartTotal = writable(0);
export const currentTableName = writable('');
export const paidAmount = writable(0); 
export const DepartmentId = writable(0);
export const returnHome = writable(false);
export const globalDepartmentModal = writable(false);
export const currentUser = writable([]);
export const showLoginModal2 = writable(false);
export const returnDept = writable(false);
export const eatModal = writable(false);
export const eatState = writable('Eat In');

export const loginProcess = writable(['eatModal','departmentModal'])

