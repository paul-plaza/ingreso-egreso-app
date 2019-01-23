import * as fromAuthActions from "./auth.actions"
import { User } from './user.model';

export interface AuthState {
    user: User
}

const initState: AuthState = {
    user: null
}

export function authReducer(state = initState, action: fromAuthActions.actions) {

    switch (action.type) {
        case fromAuthActions.SET_USER:

            return {
                user: {
                    ...action.user
                }
            }

        default:
            return state;
    }
}