import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { LoginSchema } from "../schemas/loginSchema";
import { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            try {
                const response = await agent.post('/login?useCookies=true', creds);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<{ detail: string }>;
                if (axiosError?.response?.data?.detail === 'NotAllowed') {
                    throw new Error('NotAllowed');
                }
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post('/account/register', creds);
        }
    });

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['activities'] });
            navigate('/');
        }
    });

    const verifyEmail = useMutation({
        mutationFn: async ({ userId, code }: { userId: string; code: string }) => {
            await agent.get(`/confirmEmail?userId=${userId}&code=${code}`);
        }
    });

    const resendConfirmationEmail = useMutation({
        mutationFn: async ({ email, userId }: { email?: string, userId?: string | null }) => {
            await agent.get(`/account/resendConfirmEmail`, {
                params: {
                    email,
                    userId
                }
            })
        },
        onSuccess: () => {
            toast.success('Email sent - please check your inbox');
        }
    })

    const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user'])
    });

    return {
        loginUser,
        registerUser,
        logoutUser,
        currentUser,
        loadingUserInfo,
        verifyEmail,
        resendConfirmationEmail
    };
};
