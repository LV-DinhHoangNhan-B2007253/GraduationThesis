"use client";
import GoogleButton from "@/components/GoogleButton";
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
          color="secondary"
          classNames={{
            tabList:
              "gap-6 w-full bg-light-modal-popup dark:bg-dark-modal-popup ",
            cursor: "w-full",
            tab: " h-12",
            tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          }}
        >
          <Tab key="photos" title="Photo" className="w-full">
            <Card className="rounded-lg h-screen w-full bg-light-modal-popup dark:bg-dark-modal-popup">
              <CardBody className=" ">
                <ProductManagement />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="music" title="Music">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
          <Tab key="videos" title="Videos">
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default Management;
