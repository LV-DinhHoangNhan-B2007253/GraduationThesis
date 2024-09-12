"use client";

import Spinner from "@/components/Spinner";
import { IArea } from "@/interfaces/area.interface";
import { ICategory } from "@/interfaces/category.interface";
import { AddCategoryItem, GetAllArea } from "@/services/area.service";
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

function CreateCategoryForm() {
  const [area, setArea] = useState<IArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<IArea>();
  const [category, setCategory] = useState<{ name: string }>({ name: "" });

  const handleSelectArea = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedItem = area.find((area) => area._id === selectedId);
    setSelectedArea(selectedItem);
  };
  const getAreaList = async () => {
    try {
      const areas = await GetAllArea();
      setArea(areas);
      setSelectedArea(areas[0]);
    } catch (error) {}
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const categoryId = selectedArea?._id as string;
      const res = await AddCategoryItem(categoryId, category as any);
      if (res && res.message) {
        toast.success(`${res.message}`);
      }
    } catch (error: any) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getAreaList();
  }, []);
  return (
    <section>
      <form className="grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <label
            htmlFor="area"
            className="block p-2 text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base cursor-pointer "
          >
            Select Area <span className="text-red-500">(*)</span>
          </label>
          {area.length > 0 && (
            <select
              onChange={handleSelectArea}
              name="area"
              id="area"
              className="w-full border text-center capitalize py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4"
            >
              {area.map((item) => (
                <option value={item._id} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="category"
            className="block p-2 text-light-primary-text dark:text-dark-primary-text text-sm sm:text-base cursor-pointer "
          >
            Category name
          </label>
          <input
            onChange={(e) => setCategory({ name: e.target.value })}
            type="text"
            name="category"
            id="category"
            required
            className="w-full border  py-2 rounded-md bg-light-input-field dark:bg-dark-input-field text-light-input-text dark:text-dark-input-text border-light-input-border dark:border-dark-input-border px-4 focus:border-light-active dark:focus:border-dark-active outline-none"
          />
        </div>
        {selectedArea && (
          <div className="col-span-3">
            <h3>Selected Area: {selectedArea.name}</h3>
            <img
              src={selectedArea.banner}
              alt={selectedArea.name}
              className="w-full"
            />
          </div>
        )}
        <button
          onClick={handleCreateCategory}
          type="submit"
          className="col-span-1 col-start-3 w-full bg-light-btn-bg dark:bg-dark-bg-btn text-light-btn-text dark:text-dark-btn-text p-2 rounded-md hover:bg-orange-500 transition-all"
        >
          Add
        </button>
      </form>
    </section>
  );
}

export default CreateCategoryForm;
