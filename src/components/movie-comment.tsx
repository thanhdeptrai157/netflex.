"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useComments } from "@/hooks/useComments"
import { useUserStore } from "@/stores/userStore"


interface MovieCommentsProps {
    slug: string
}

export default function MovieComments({ slug }: MovieCommentsProps) {

    const { comments, isLoading, newComment, setNewComment, isPosting, handlePostComment } = useComments(slug)
    const user = useUserStore((state) => state.user)


    const formatDate = (timeStamp: number) => {
        const date = new Date(timeStamp)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds} giây trước`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`

        return date.toLocaleDateString("vi-VN")
    }

    return (
        <div className="w-full bg-slate-800 rounded-lg p-4 md:p-6 mt-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="inline-block w-1 h-6 bg-red-600 mr-3 rounded"></span>
                Bình luận
            </h2>

            <form onSubmit={handlePostComment} className="mb-8">
                <div className="relative mb-4">
                    <textarea
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        rows={3}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                        {newComment.length > 0 ? `${newComment.length} ký tự` : ""}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isPosting || !newComment.trim()}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-lg text-white font-semibold transition-all duration-200 ${isPosting || !newComment.trim()
                        ? "bg-gray-500 cursor-not-allowed opacity-70"
                        : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
                        }`}
                >
                    {isPosting ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Đang đăng...
                        </span>
                    ) : (
                        "Đăng bình luận"
                    )}
                </button>
            </form>
            {isLoading ? 
            (
                Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-700 rounded-lg w-full animate-pulse h-[100px] mb-4"
                    />
                ))
            ) :
                (<div className="space-y-4">
                    <AnimatePresence>
                        {comments.length > 0 ? (
                            comments.map((comment, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors"
                                >
                                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        <img src={comment.avatar} alt={comment.userName} className="rounded-full" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                            <h3 className="font-medium text-white text-base">{comment.uid === user?.uid ? "Bạn" : comment.userName}</h3>
                                            <span className="text-xs text-slate-400 sm:text-right">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-slate-200 mt-2 leading-relaxed">{comment.content}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-slate-400 text-center py-8 border border-dashed border-slate-700 rounded-lg"
                            >
                                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>)}
        </div>
    )
}
