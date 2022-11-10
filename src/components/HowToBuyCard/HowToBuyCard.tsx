import clsx from "clsx";
import React, { useContext } from "react";
import { ScrollContext } from "../../context/ScrollContext";
import { Component } from "../../types/Util";
import Button from "../Button";
import Card from "../Card";
import CardBoxes, { CardBox } from "../CardBoxes";
import Input from "../Input";

import "./HowToBuyCard.css";
import { ContractSection, NewToCryptoSection, HowToBuySection, SecureSection } from "./Sections";

const HowToBuyCard: Component = () => {
  return (
    <Card className="how-card">
      <img
        loading="lazy"
        className="top-illustration"
        src="/img/plants/plants.webp"
        alt="Image of plants"
      />
      <h1 className="how-title">How to buy Big Eyes</h1>
      <HowToBuySection />
      <div className="divider" />
      <ContractSection />
      <div className="divider" />
      <SecureSection />
      <div className="divider" />
      <NewToCryptoSection />
    </Card>
  );
};

export default HowToBuyCard;
