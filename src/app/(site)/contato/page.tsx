import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import curitiba from "@/img/contato/curitiba.png";
import colombo from "@/img/contato/colombo.png";
import pontaGrossa from "@/img/contato/ponta-grossa.png";
import address from "@/img/icons/address.png";
import whatsapp from "@/img/icons/whatsapp.png";

export default function Contato() {
    return (
        <div className={styles.container}>
            <div className={styles.containerCard}>
                <div className={styles.text}>
                    <h1>Unidade Curitiba</h1>
                    <p>Rod, BR-116, 15138 - Fanny, Curitiba - PR, 81690-200</p>
                    <Link href="tel:+554135693191">
                        <h5>(41) 3569-3191</h5>
                    </Link>
                    <h5>Segunda - Sexta: 08:00 - 18:00</h5>
                    <div className={styles.icons}>
                        <Link href="https://maps.app.goo.gl/TaNhLqkLpfQFHYZV6" target="_blank">
                            <Image src={address} alt="Endereço" />
                        </Link>
                        <Link href="https://api.whatsapp.com/send?phone=554135693191&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">
                            <Image src={whatsapp} alt="WhatsApp" />
                        </Link>
                    </div>
                </div>
                <div className={styles.image}>
                    <Image src={curitiba} alt="Fachada Curitiba" />
                </div>
            </div>
            <div className={styles.containerCard}>
                <div className={styles.text}>
                    <h1>Unidade Colombo</h1>
                    <p>R. Antônio Betinardi, 611 - Guaraituba, Colombo - PR, 83407-425</p>
                    <Link href="tel:+554136065101">
                        <h5>(41) 3606-5101</h5>
                    </Link>
                    <h5>Segunda-Sexta: 08:00 - 18:00 <br/>
                        Sábado: 08:00 - 12:00</h5>
                    <div className={styles.icons}>
                        <Link href="https://maps.app.goo.gl/rWtE35kC6qXUky4z6" target="_blank">
                            <Image src={address} alt="Endereço" />
                        </Link>
                        <Link href="https://api.whatsapp.com/send?phone=554136065101&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">
                            <Image src={whatsapp} alt="WhatsApp" />
                        </Link>
                    </div>
                </div>
                <div className={styles.image}>
                    <Image src={colombo} alt="Fachada Colombo" />
                </div>
            </div>
            <div className={styles.containerCard}>
                <div className={styles.text}>
                    <h1>Unidade Ponta Grossa</h1>
                    <p>Av. Pres. Kennedy, 3295 - Contorno, Ponta Grossa - PR, 84052-465</p>
                    <Link href="tel:+554232271903">
                        <h5>(42) 3227-1903</h5>
                    </Link>
                    <h5>Segunda-Sexta: 08:00 - 18:00 <br/>
                        Sábado: 08:00 - 12:00</h5>
                    <div className={styles.icons}>
                        <Link href="https://maps.app.goo.gl/qTeYcuagnENrkwyr8" target="_blank">
                            <Image src={address} alt="Endereço" />
                        </Link>
                        <Link href="https://api.whatsapp.com/send?phone=554232271903&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">
                            <Image src={whatsapp} alt="WhatsApp" />
                        </Link>
                    </div>
                </div>
                <div className={styles.image}>
                    <Image src={pontaGrossa} alt="Fachada Ponta Grossa" />
                </div>
            </div>
        </div>
    );
}