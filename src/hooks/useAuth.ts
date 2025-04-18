import { auth } from "@/lib/firebase"
import { loginWithGoogle, signOutFirebase } from "@/services/firebaseAuth"
import { useUserStore } from "@/stores/userStore"
import { sign } from "crypto"
import { use, useEffect, useState } from "react"

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {clearUser} = useUserStore()

    // kiểm tra trạng thái đăng nhập của người dùng
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
            setLoading(false)
        }, (error) => {
            setError(error.message)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])
    
    const login = async () => {
        setLoading(true)
        setError(null)
        try {
            const user = await loginWithGoogle()
            setUser(user)  
        }
        catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        setError(null)
        try {
            await signOutFirebase()
            setUser(null)
            clearUser()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    return {
        user,
        loading,
        error,
        login,
        logout,
    }
}