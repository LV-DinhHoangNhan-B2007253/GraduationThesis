"use client";
import GoogleButton from "@/components/GoogleButton";
import CustomerManagement from "@/components/management/CustomerManagement";
import OrderManagement from "@/components/management/OrderManagement";
import ProductManagement from "@/components/management/ProductManagement";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";

function Management() {
  return (
    <MainLayout>
      <div className="px-3">
        <Tabs
          aria-label="Options"
          size="lg"
          radius="lg"
          fullWidth={true}
          color="warning"
          classNames={{
            tabList:
              "gap-6 w-full bg-light-modal-popup dark:bg-dark-modal-popup ",
            cursor: "w-full",
            tab: " h-12",
            tabContent: "group-data-[selected=true]:text-[#ffffff]",
          }}
        >
          <Tab key="productManagement" title="Product " className="w-full">
            <Card className="rounded-lg h-screen w-full bg-light-modal-popup dark:bg-dark-modal-popup">
              <CardBody className=" ">
                <ProductManagement />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="order" title="Order">
            <Card className="rounded-lg h-screen w-full bg-light-modal-popup dark:bg-dark-modal-popup">
              <CardBody>
                <OrderManagement />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="customer" title="Customer ">
            <Card className="rounded-lg h-screen w-full bg-light-modal-popup dark:bg-dark-modal-popup">
              <CardBody>
                <CustomerManagement />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default Management;
