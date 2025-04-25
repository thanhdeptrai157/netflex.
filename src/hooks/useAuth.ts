import { auth } from "@/lib/firebase"
import { loginWithGoogle, signOutFirebase } from "@/services/firebaseAuthService"
import { useUserStore } from "@/stores/userStore"
import { useEffect, useState } from "react"
import { getRecommendedMovies } from "@/services/recommendedMoviesService"


export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {clearUser, clearLikedMovies, setLikedMovies, setWatchedMoviesCount, setRecommendedMovies} = useUserStore()

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
            setLikedMovies()
            setWatchedMoviesCount()
            // Gọi recommend và lưu vào store
            const recommended = await getRecommendedMovies(user.uid)
            console.log("Recommended movies:", recommended)
            setRecommendedMovies(recommended)
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
            clearLikedMovies()
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