
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Request } from 'express';
import { fileUploader } from '../../../helpars/fileUploader';
import ApiError from '../../../errors/ApiErrors';


const createIntoDb = async (req:Request) => {
  const stringify = req.body.data;
  if(!stringify){
    throw new ApiError(httpStatus.NOT_FOUND,"Data not found");
  }
  const parsedData = JSON.parse(stringify);

  const file=req.file;
  if(!file){
    throw new ApiError(httpStatus.NOT_FOUND,"File not found");
  }

  const uploadedFileUrl = await fileUploader.uploadToCloudinary(file);
  const result=await prisma.banner.create({
    data: {
      ...parsedData,
      image: uploadedFileUrl.Location,
    },
  });
  return result;
};

const getListFromDb = async () => {
  
    const result = await prisma.banner.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.banner.findUnique({ where: { id } });
    if (!result) {
      throw new Error('banner not found');
    }
    return result;
  };



const updateIntoDb = async (req:Request) => {
  const stringify = req.body.data;
  let parsedData;
  const existingBanner = await prisma.banner.findFirst({
    where: {
      id: req.params.id,
    },
  });
    if (!existingBanner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
    }
    if (stringify) {
      parsedData = JSON.parse(stringify);
    }
    const file=req.file;
    let imageUrl;
    if(file){
      imageUrl = await fileUploader.uploadToCloudinary(file);
    }

    const result = await prisma.banner.update({
      where: {
        id: existingBanner.id,
      },
      data: {
        ...parsedData,
        image: imageUrl ? imageUrl.Location : existingBanner.image,
      },
    });

    return result;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.banner.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
;

export const bannerService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};