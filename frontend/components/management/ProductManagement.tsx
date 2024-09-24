"use client";

import {
  faArrowLeft,
  faArrowRight,
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
import ProductDetailCard from "./card/ProductDetailCard";
import { IProduct } from "@/interfaces/product.interface";
import { toast } from "react-toastify";
import { GetAllProducts, SearchProduct } from "@/services/product.service";

function ProductManagement() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filterOption, setFilterOption] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const limit: number = 10;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchProducts = async () => {
    try {
      const data = await GetAllProducts(page, limit);
      let total = data.totalProduct;
      let pro = data.products;
      pro = pro.filter(
        (product: IProduct, index: any, self: any) =>
          index === self.findIndex((p: IProduct) => p._id === product._id)
      );
      setProducts(pro);
      setTotalPages(Math.ceil(total / limit));
      // setTotalPages(total);
    } catch (error) {
      toast.error("Cannot get");
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
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
  }, [page]);

  return (
    <section>
      <div className="flex items-center justify-between">
        {/* create new product */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={onOpen}
              className="px-1 py-2 text-center border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              + New
            </Button>

            <Button
              onClick={handleProductDeleted}
              className="px-1 py-2 text-center border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border"
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
            <div className="flex items-center justify-between gap-2 ">
              <input
                type="text"
                name="search"
                className="w-full px-1 py-2 border rounded bg-light-input-field text-light-input-text border-light-input-border dark:text-dark-input-text dark:bg-dark-input-field dark:border-dark-input-border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                onClick={handleSearch}
                className="p-3 text-center transition-all border rounded cursor-pointer border-light-input-border dark:border-dark-border hover:bg-dark-bg-btn-hover hover:text-white"
              />
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="auto"
            size="5xl"
            scrollBehavior="inside"
            style={{
              marginTop: "250px",
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <p className="w-full text-center"> Add New Product</p>
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
                          <Card className="w-full rounded-lg bg-light-modal-popup dark:bg-dark-modal-popup">
                            <CardBody>
                              <CreateAreaForm />
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab title="New Category" key="category">
                          <Card className="w-full rounded-lg bg-light-modal-popup dark:bg-dark-modal-popup">
                            <CardBody>
                              <CreateCategoryForm />
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab title="New Product" key="product">
                          <Card className="w-full rounded-lg bg-light-modal-popup dark:bg-dark-modal-popup">
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
            className="px-1 py-2 text-center capitalize border rounded-lg bg-light-modal-popup text-light-primary-text border-light-modal-border dark:bg-dark-modal-popup dark:text-dark-btn-text dark:border-dark-border w-36"
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="az">a-z</option>
            <option value="za">z-a</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between p-2  bg-light-modal-popup dark:bg-dark-modal-popup ">
        <button onClick={handlePrevPage} disabled={page === 1}>
          &lt; Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next &gt;
        </button>
      </div>
      {/* product list */}
      <div>
        {products.map((prod) => (
          <div className="my-2">
            <ProductDetailCard
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
