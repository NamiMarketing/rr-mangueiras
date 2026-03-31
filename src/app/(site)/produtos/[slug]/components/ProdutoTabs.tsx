"use client";

import { useState } from "react";
import styles from "../produto.module.css";

interface ProdutoTabsProps {
  descricao?: string;
}

export default function ProdutoTabs({ descricao }: ProdutoTabsProps) {
  const [activeTab, setActiveTab] = useState<"descricao" | "ficha" | "downloads">("descricao");

  return (
    <>
      <div className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === "descricao" ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab("descricao")}
          >
            Descrição
          </button>
          <button
            className={`${styles.tab} ${activeTab === "ficha" ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab("ficha")}
          >
            Ficha técnica
          </button>
          <button
            className={`${styles.tab} ${activeTab === "downloads" ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab("downloads")}
          >
            Downloads
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "descricao" && (
          descricao ? (
            <p className={styles.tabText}>{descricao}</p>
          ) : (
            <p className={styles.tabEmpty}>Nenhuma descrição disponível.</p>
          )
        )}
        {activeTab === "ficha" && (
          <p className={styles.tabEmpty}>Ficha técnica não disponível no momento.</p>
        )}
        {activeTab === "downloads" && (
          <p className={styles.tabEmpty}>Nenhum download disponível no momento.</p>
        )}
      </div>
    </>
  );
}
