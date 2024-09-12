"use client";

import { ICreateArea } from "@/interfaces/area.interface";
import { CreateArea } from "@/services/area.service";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

function CreateAreaForm() {
  const [createAreaForm, setCreateAreaForm] = useState<ICreateArea>({
    name: "",
    banner: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCreateAreaForm({
        ...createAreaForm,
        banner: e.target.files[0], // Lưu đối tượng File vào state
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(createAreaForm);

    if (!createAreaForm.name.trim()) {
      toast.error(
        "Area name is required and cannot be empty or only whitespace"
      );
      return;
    }

    if (!createAreaForm.banner) {
      toast.error("Please select a banner image.");
      return;
    }
    const formData = new FormData();
    formData.append("name", createAreaForm.name);
    if (createAreaForm.banner instanceof File) {
      formData.append("banner", createAreaForm.banner);
    }

    try {
      const res = await CreateArea(formData);
      if (res && res.message) {
        toast.success(`${res.message}`);
      }
    } catch (error: any) {
      toast.error(`create area failed ${error}`);
    }
  };

  return (
    <div>
      <form
        className="grid grid-cols-2 gap-4 items-center"
        onSubmit={handleSubmit}
      >
        <div className="col-span-1">
          <label
            htmlFor="name"
            className="block w-fit text-light-primary-text dark:text-dark-primary-text text-small sm:text-base my-2"
          >
            Area Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-2 py-1 rounded bg-light-input-field text-light-input-text border border-light-input-border dark:text-dark-input-text dark:bg-dark-input-field dark:border-dark-input-border"
            onChange={(e) =>
              setCreateAreaForm({ ...createAreaForm, name: e.target.value })
            }
          />
        </div>
        <div className="col-span-1">
          <label
            htmlFor="banner"
            className="block w-fit text-light-primary-text dark:text-dark-primary-text text-small sm:text-base my-2"
          >
            Banner
          </label>
          <input
            type="file"
            name="banner"
            id="banner"
            required
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {createAreaForm.banner && (
          <div className="col-span-2">
            <img
              src={URL.createObjectURL(createAreaForm.banner as File)}
              alt="Banner Preview"
              className="w-full object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          className="col-span-2 sm:col-span-1 sm:col-start-2 w-full px-2 py-1 rounded text-light-btn-text dark:text-dark-btn-text bg-light-btn-bg dark:bg-dark-bg-btn hover:bg-orange-500 transition-all"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateAreaForm;
