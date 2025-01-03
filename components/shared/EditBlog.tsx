import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type Props = {
    setShowEditModal: string;
    titleToEdit: string;
    contentToEdit: string;
    setTitleToEdit: (value : string) => void;
    setContentToEdit: (value : string) => void;
    editBlog: () => void;
    editId: string;
};

const EditBlog = ({setShowEditModal,titleToEdit,contentToEdit,setTitleToEdit,setContentToEdit,editBlog,editId}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="p-10 flex flex-col gap-3 w-96 sm:w-600 mx-8 bg-gray-100">
        <div className="flex text-center justify-between align-middle">
            <h1 className="text-2xl font-bold">Edit Blog</h1>
            <X onClick={() => {setShowEditModal(prev => !prev)}}/>
        </div>
        <div className="flex flex-col gap-5 ">
            <div className="flex flex-col gap-2">
            <label className="text-gray-600">Title</label>
            <Input onChange={(e) => setTitleToEdit(e.target.value)} value={titleToEdit} />
            </div>

            <div className="flex flex-col gap-2">
            <label className="text-gray-600">Content</label>
            <Textarea onChange={(e) => setContentToEdit(e.target.value)} value={contentToEdit} className="w-full h-96 sm:h-96"/>
            </div>
        </div>
        <Button onClick={() => {editBlog(editId)}} className="">Submit</Button>
      </Card>
    </div>
  );
};

export default EditBlog;
