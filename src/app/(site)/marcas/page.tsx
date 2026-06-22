import Image from "next/image";
import styles from "./page.module.css";
import logo1 from "@/img/marcas/logo1.png";
import logo2 from "@/img/marcas/logo2.png";
import logo3 from "@/img/marcas/logo3.png";
import logo4 from "@/img/marcas/logo4.png";
import logo5 from "@/img/marcas/logo5.png";
import logo6 from "@/img/marcas/logo6.png";
import logo7 from "@/img/marcas/brasfit.png";
import logo8 from "@/img/marcas/kanaflex.png";


export default function Marcas() {
    return (
        <div className={styles.container}>
            <h1>Marcas que trabalhamos</h1>
            <div className={styles.logos}>
                <Image src={logo6} alt="Logo 6" />
                <Image src={logo2} alt="Logo 2" />
                <Image src={logo4} alt="Logo 4" />
                <Image src={logo1} alt="Logo 1" />
                <Image src={logo5} alt="Logo 5" />
                <Image src={logo3} alt="Logo 3" />
                <Image src={logo7} alt="Logo 7" />
                <Image style={{ width: '13%', height: '100%' }} src={logo8} alt="Logo 8" />
            </div>
        </div>
    );
}