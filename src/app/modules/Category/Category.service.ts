
import { UserRole, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../../errors/ApiErrors';
import { fileUploader } from '../../../helpars/fileUploader';


const createIntoDb = async (req:Request) => {
  const stringify = req.body.data;
  if(!stringify){
    throw new ApiError(httpStatus.BAD_REQUEST, "Data not found");
  }
  const parsedData = JSON.parse(stringify);

  const file=req.file;
  if(!file){
    throw new ApiError(httpStatus.BAD_REQUEST, "File not found");
  }

  const uploadedFileUrl = await fileUploader.uploadToCloudinary(file);
  const result=await prisma.category.create({
    data: {
      ...parsedData,
      image: uploadedFileUrl.Location,
    },
  });
  return result;

};

const getListFromDb = async () => {
  
    const result = await prisma.category.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.category.findUnique({ where: { id } });
    if (!result) {
      throw new Error('category not found');
    }
    return result;
  };



  const updateIntoDb = async (req: Request) => {
    const stringify = req.body.data;
    
  let parsedData;
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: req.params.id,
    },
  });
    if (!existingCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    if (stringify) {
       parsedData = JSON.parse(stringify);
    }

  
    // Optional file upload (only if user uploads new file)
    const file = req.file;
    let uploadedFileUrl;
  
    if (file) {
      uploadedFileUrl = await fileUploader.uploadToCloudinary(file);
    }
    const result = await prisma.category.update({
      where: {
        id: req.params.id, // Ensure `req.params.id` is valid and exists
      },
      data: {
        ...parsedData,
        image: uploadedFileUrl?.Location || existingCategory.image, // If file is uploaded, replace image
      },
    });
  
    return result;
  };
  

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.category.delete({
      where: { id },
    });
    return deletedItem;
  });

  return transaction;
};
;

export const categoryService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};