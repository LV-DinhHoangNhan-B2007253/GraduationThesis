"use client";

import { faFilter, faRefresh } from "@fortawesome/free-solid-svg-icons";
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
import React, { useEffect, useState } from "react";
import CreateAreaForm from "./form/CreateAreaForm";
import CreateCategoryForm from "./form/CreateCategoryForm";
import CreateProductForm from "./form/CreateProductForm";
import ProductCard from "./card/ProductCard";
import { IProduct } from "@/interfaces/product.interface";
import { toast } from "react-toastify";
import { GetAllProducts } from "@/services/product.service";

function ProductManagement() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filter, setFilter] = useState<string>("all");
  const [products, setProducts] = useState<IProduct[]>([]);

  const handleSelectFilter = async (e: any) => {
    setFilter(e);
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center">
        {/* create new product */}
        <div>
          <div className="flex items-center gap-2">
            <Button
              onPress={onOpen}
              className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              + New
            </Button>
            <Button
              onPress={handleProductDeleted}
              className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
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
            value={filter}
            className="px-1 py-2 text-center rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border w-36 capitalize"
            onChange={(e) => handleSelectFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="area">area</option>
            <option value="group">group</option>
            <option value="status">status</option>
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
