import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

type Props = {
    setShowDeleteModal: (value: boolean) => void;
    deleteId: string;
    deleteBlog: (value: string) => void;
}

const ConfirmDelete = ({setShowDeleteModal,deleteBlog,deleteId}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Card className='p-10 flex flex-col gap-3'>
            <h1 className='text-2xl'>Do you want to delete this blog?</h1>
            <div className='flex gap-2'>
                <Button onClick={() => {deleteBlog(deleteId)}} variant="destructive">Delete</Button>
                <Button onClick={() => {setShowDeleteModal(prev => !prev)}}>Cancel</Button>
            </div>
        </Card>
    </div>
  )
}

export default ConfirmDelete