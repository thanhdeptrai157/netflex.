import { getComments, postComment } from '@/services/commentService'
import React, { use, useEffect, useState } from 'react'
import { Comment } from '@/types/comments'
import { toast } from 'react-toastify'
import { useUserStore } from '@/stores/userStore'


export const useComments = (movieSlug: string) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const user = useUserStore((state) => state.user)

    useEffect(() => {
        const fetchCommnents = async (movieSlug: string) => {
            setIsLoading(true)
            try {
                const response = await getComments(movieSlug)
                if (response.success) {
                    setComments(response.comments)
                } else {
                    toast.error("Không thể tải bình luận", { autoClose: 1000 })
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra khi tải bình luận", { autoClose: 1000 })
            } finally {
                setIsLoading(false)
            }
        }
        fetchCommnents(movieSlug)
    }, [movieSlug])
    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return
        if (!user) {
            toast.error("Bạn cần đăng nhập để bình luận", { autoClose: 1000 })
            return
        }
        setIsPosting(true)
        try {
            const response = await postComment(movieSlug, newComment, user)
            if (response.success) {
                setComments([
                    {
                        movieSlug: movieSlug,
                        content: newComment,
                        createdAt: new Date().getTime(),
                        uid: user.uid,
                        avatar: user.photoURL ? user.photoURL : "",
                        userName: user.displayName ? user.displayName : "",
                    
                    },
                    ...comments,
                ])
                setNewComment("")
                toast.success("Bình luận của bạn đã được đăng.", { autoClose: 1000 })
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi đăng bình luận", { autoClose: 1000 })
        } finally {
            setIsPosting(false)
        }
    }
    return {
        comments,
        isLoading,
        newComment,
        setNewComment,
        isPosting,
        handlePostComment
    }
}
