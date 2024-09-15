"use client";

import {
  faFilter,
  faRefresh,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import CreateAreaForm from "./form/CreateAreaForm";
import CreateCategoryForm from "./form/CreateCategoryForm";
import CreateProductForm from "./form/CreateProductForm";
import ProductCard from "./card/ProductCard";
import { IProduct } from "@/interfaces/product.interface";
import { toast } from "react-toastify";
import { GetAllProducts, SearchProduct } from "@/services/product.service";

function ProductManagement() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filterOption, setFilterOption] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const fetchProducts = async () => {
    try {
      let data = await GetAllProducts();
      data = data.filter(
        (product: IProduct, index: any, self: any) =>
          index === self.findIndex((p: IProduct) => p._id === product._id)
      );
      setProducts(data);
      console.log(data);
    } catch (error) {
      toast.error("Cannot get");
    }
  };

  const handleProductDeleted = () => {
    // Re-fetch the product list after deletion
    fetchProducts();
  };

  // filter product => switchcase => lọc sản phẩm set vào state

  const filterProduct = (filterOptions: any) => {
    let updatedProduct = [...products];

    switch (filterOptions) {
      case "az":
        updatedProduct = updatedProduct.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "za":
        updatedProduct = updatedProduct.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      case "all":
      default:
        updatedProduct = [...products];
        break;
    }
    setProducts(updatedProduct);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const select = e.target.value;
    setFilterOption(select);
    filterProduct(select);
  };
  const handleSearch = async () => {
    try {
      const result = await SearchProduct(query);
      setProducts(result);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center">
        {/* create new product */}
        <div>
          <div className="flex justify-between items-center gap-2">
            <Button
              onClick={onOpen}
              className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              + New
            </Button>

            <Button
              onClick={handleProductDeleted}
              className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
            <div className="flex justify-between items-center gap-2 ">
              <input
                type="text"
                name="search"
                className=" border  w-full px-1 py-2 rounded  bg-light-input-field text-light-input-text  border-light-input-border dark:text-dark-input-text dark:bg-dark-input-field dark:border-dark-input-border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                onClick={handleSearch}
                className="p-3 text-center cursor-pointer rounded border border-light-input-border dark:border-dark-border hover:bg-dark-bg-btn-hover transition-all hover:text-white"
              />
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="5xl"
            scrollBehavior="inside"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <p className="text-center w-full"> Add New Product</p>
                  </ModalHeader>
                  <ModalBody>
                    <div className="px-3">
                      <Tabs
                        aria-label="Options"
                        size="md"
                        radius="lg"
                        fullWidth={true}
                        color="secondary"
                        variant="underlined"
                        classNames={{
                          tabList:
                            "gap-6 w-full bg-light-modal-popup dark:bg-dark-modal-popup ",
                          cursor: "w-full",
                          tab: " h-12",
                          tabContent:
                            "group-data-[selected=true]:text-[#06b6d4]",
                        }}
                      >
                        <Tab title="New Area" key="area">
                          <Card className="rounded-lg w-full bg-light-modal-popup dark:bg-dark-modal-popup">
                            <CardBody>
                              <CreateAreaForm />
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab title="New Category" key="category">
                          <Card className="rounded-lg w-full bg-light-modal-popup dark:bg-dark-modal-popup">
                            <CardBody>
                              <CreateCategoryForm />
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab title="New Product" key="product">
                          <Card className="rounded-lg w-full bg-light-modal-popup dark:bg-dark-modal-popup">
                            <CardBody>
                              <CreateProductForm />
                            </CardBody>
                          </Card>
                        </Tab>
                      </Tabs>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
        {/* filter */}
        <div>
          <select
            name="filter"
            id="filter"
            value={filterOption}
            className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border w-36 capitalize"
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="az">a-z</option>
            <option value="za">z-a</option>
          </select>
        </div>
      </div>
      {/* product list */}
      <div>
        {products.map((prod) => (
          <div className="my-2">
            <ProductCard
              product={prod}
              key={prod._id}
              onProductDeleted={handleProductDeleted}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductManagement;
