import create from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import axios from 'axios'

interface State {
    isLoading: boolean
    error: string
    id: string
    wallet: string
    email: string
    emailVerified: boolean
    hasFounderPass: boolean
    hasWallet: boolean
    isWhitelist: boolean
}

interface Action {
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    register: (data: {
        username: string
        email: string
        password: string
    }) => void
    reset: () => void
}

const initialState: State = {
    isLoading: false,
    error: '',
    id: '',
    wallet: '',
    email: '',
    emailVerified: false,
    hasFounderPass: false,
    hasWallet: false,
    isWhitelist: false,
}

export const useUser = create(
    devtools(
        persist<State & Action>(
            (set, get) => ({
                ...initialState,
                login: async (email: string, password: string) => {
                    set(() => ({ isLoading: true }))

                    let success = false
                    try {
                        const authResult = await axios.post('/auth', {
                            email,
                            password,
                        })

                        if (authResult.data.payload.ban) {
                            throw 'You are banned, please contact HELIX support team.'
                        }

                        // fetch authorization
                        localStorage.setItem(
                            'authenticationToken',
                            authResult.data.payload.authorization,
                        )

                        const userResult = await axios.get('/user/')

                        if (authResult.data.wallet_associated) {
                            const result = await axios.get('/ethuser')
                            set((state) => ({
                                wallet: result.data.address,
                            }))
                        }

                        set(() => ({
                            id: userResult.data.id,
                            wallet: '',
                            email: userResult.data.email,
                            emailVerified: authResult.data.email_verified,
                            hasFounderPass: authResult.data.own_founder_pass,
                            hasWallet: authResult.data.wallet_associated,
                            isWhitelist: userResult.data.whitelisted,
                        }))

                        success = true
                    } catch (e: any) {
                        set((state) => ({
                            error: e,
                        }))
                    }
                    set(() => ({ isLoading: false }))
                    return success
                },
                register: async (data) => {
                    // set(() => ({isLoading: true}));
                    // if (data.address) {
                    //     try {
                    //         const registerResponse = await axios.post("/ethuser/", data);
                    //         console.log(registerResponse.data);
                    //     } catch (e: any) {
                    //         console.log(e);
                    //         set((state) => ({
                    //             error: e,
                    //         }))
                    //     }
                    // } else {
                    //     set(() => ({error: "Did not link to wallet!"}))
                    // }
                    // set(() => ({isLoading: false}));
                },
                logout: () =>
                    set((state) => ({
                        isLoading: false,
                        id: '',
                    })),
                reset: () => set(initialState),
            }),
            {
                name: 'user-data',
                getStorage: () => localStorage,
                serialize: (state) => {
                    const data = {
                        ...state,
                    }
                    data.state.error = ''
                    data.state.isLoading = false
                    return JSON.stringify(data)
                },
            },
        ),
    ),
)
