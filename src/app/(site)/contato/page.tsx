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
                    <Link href="mailto:vendas.curitiba@rrmangueiras.com.br">
                        <h5>vendas.curitiba@rrmangueiras.com.br</h5>
                    </Link>
                    <h5>Segunda - Sexta: 08:00 - 18:00</h5>
                    <div className={styles.icons}>
                        <Link href="https://maps.app.goo.gl/TaNhLqkLpfQFHYZV6" target="_blank">
                            <Image src={address} alt="Endereço" />
                        </Link>
                        <Link href="https://api.whatsapp.com/send?phone=554135693191&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">
                            <Image src={whatsapp} alt="WhatsApp" />
                        </Link>
                        <Link href="mailto:vendas.curitiba@rrmangueiras.com.br">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17" cy="17" r="17" fill="#F8BB00"/>
                            <path d="M23.6667 10.3335H10.3333C9.41667 10.3335 8.67501 11.0835 8.67501 12.0002L8.66667 22.0002C8.66667 22.9168 9.41667 23.6668 10.3333 23.6668H23.6667C24.5833 23.6668 25.3333 22.9168 25.3333 22.0002V12.0002C25.3333 11.0835 24.5833 10.3335 23.6667 10.3335ZM23.3333 13.8752L17.4417 17.5585C17.175 17.7252 16.825 17.7252 16.5583 17.5585L10.6667 13.8752C10.5831 13.8283 10.5099 13.7649 10.4516 13.6889C10.3932 13.6129 10.3509 13.5258 10.3272 13.433C10.3034 13.3401 10.2988 13.2434 10.3135 13.1488C10.3282 13.0541 10.362 12.9633 10.4127 12.8821C10.4635 12.8008 10.5303 12.7307 10.6089 12.676C10.6876 12.6213 10.7766 12.5831 10.8704 12.5637C10.9643 12.5444 11.0611 12.5443 11.155 12.5635C11.2489 12.5826 11.3379 12.6206 11.4167 12.6752L17 16.1668L22.5833 12.6752C22.6621 12.6206 22.7512 12.5826 22.845 12.5635C22.9389 12.5443 23.0357 12.5444 23.1296 12.5637C23.2234 12.5831 23.3124 12.6213 23.3911 12.676C23.4697 12.7307 23.5365 12.8008 23.5873 12.8821C23.6381 12.9633 23.6718 13.0541 23.6865 13.1488C23.7013 13.2434 23.6966 13.3401 23.6729 13.433C23.6491 13.5258 23.6068 13.6129 23.5484 13.6889C23.4901 13.7649 23.4169 13.8283 23.3333 13.8752Z" fill="white"/>
                            </svg>
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
                    <Link href="mailto:vendas.colombo@rrmangueiras.com.br">
                        <h5>vendas.colombo@rrmangueiras.com.br</h5>
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
                        
                        <Link href="mailto:vendas.colombo@rrmangueiras.com.br">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17" cy="17" r="17" fill="#F8BB00"/>
                            <path d="M23.6667 10.3335H10.3333C9.41667 10.3335 8.67501 11.0835 8.67501 12.0002L8.66667 22.0002C8.66667 22.9168 9.41667 23.6668 10.3333 23.6668H23.6667C24.5833 23.6668 25.3333 22.9168 25.3333 22.0002V12.0002C25.3333 11.0835 24.5833 10.3335 23.6667 10.3335ZM23.3333 13.8752L17.4417 17.5585C17.175 17.7252 16.825 17.7252 16.5583 17.5585L10.6667 13.8752C10.5831 13.8283 10.5099 13.7649 10.4516 13.6889C10.3932 13.6129 10.3509 13.5258 10.3272 13.433C10.3034 13.3401 10.2988 13.2434 10.3135 13.1488C10.3282 13.0541 10.362 12.9633 10.4127 12.8821C10.4635 12.8008 10.5303 12.7307 10.6089 12.676C10.6876 12.6213 10.7766 12.5831 10.8704 12.5637C10.9643 12.5444 11.0611 12.5443 11.155 12.5635C11.2489 12.5826 11.3379 12.6206 11.4167 12.6752L17 16.1668L22.5833 12.6752C22.6621 12.6206 22.7512 12.5826 22.845 12.5635C22.9389 12.5443 23.0357 12.5444 23.1296 12.5637C23.2234 12.5831 23.3124 12.6213 23.3911 12.676C23.4697 12.7307 23.5365 12.8008 23.5873 12.8821C23.6381 12.9633 23.6718 13.0541 23.6865 13.1488C23.7013 13.2434 23.6966 13.3401 23.6729 13.433C23.6491 13.5258 23.6068 13.6129 23.5484 13.6889C23.4901 13.7649 23.4169 13.8283 23.3333 13.8752Z" fill="white"/>
                            </svg>
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
                    <Link href="mailto:vendas.pontagrossa@rrmangueiras.com.br">
                        <h5>vendas.pontagrossa@rrmangueiras.com.br</h5>
                    </Link>
                    <h5>Segunda-Sexta: 08:00 - 18:00 </h5>
                    <div className={styles.icons}>
                        <Link href="https://maps.app.goo.gl/qTeYcuagnENrkwyr8" target="_blank">
                            <Image src={address} alt="Endereço" />
                        </Link>
                        <Link href="https://api.whatsapp.com/send?phone=554232271903&text=Estava%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">
                            <Image src={whatsapp} alt="WhatsApp" />
                        </Link>
                        <Link href="mailto:vendas.pontagrossa@rrmangueiras.com.br">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17" cy="17" r="17" fill="#F8BB00"/>
                            <path d="M23.6667 10.3335H10.3333C9.41667 10.3335 8.67501 11.0835 8.67501 12.0002L8.66667 22.0002C8.66667 22.9168 9.41667 23.6668 10.3333 23.6668H23.6667C24.5833 23.6668 25.3333 22.9168 25.3333 22.0002V12.0002C25.3333 11.0835 24.5833 10.3335 23.6667 10.3335ZM23.3333 13.8752L17.4417 17.5585C17.175 17.7252 16.825 17.7252 16.5583 17.5585L10.6667 13.8752C10.5831 13.8283 10.5099 13.7649 10.4516 13.6889C10.3932 13.6129 10.3509 13.5258 10.3272 13.433C10.3034 13.3401 10.2988 13.2434 10.3135 13.1488C10.3282 13.0541 10.362 12.9633 10.4127 12.8821C10.4635 12.8008 10.5303 12.7307 10.6089 12.676C10.6876 12.6213 10.7766 12.5831 10.8704 12.5637C10.9643 12.5444 11.0611 12.5443 11.155 12.5635C11.2489 12.5826 11.3379 12.6206 11.4167 12.6752L17 16.1668L22.5833 12.6752C22.6621 12.6206 22.7512 12.5826 22.845 12.5635C22.9389 12.5443 23.0357 12.5444 23.1296 12.5637C23.2234 12.5831 23.3124 12.6213 23.3911 12.676C23.4697 12.7307 23.5365 12.8008 23.5873 12.8821C23.6381 12.9633 23.6718 13.0541 23.6865 13.1488C23.7013 13.2434 23.6966 13.3401 23.6729 13.433C23.6491 13.5258 23.6068 13.6129 23.5484 13.6889C23.4901 13.7649 23.4169 13.8283 23.3333 13.8752Z" fill="white"/>
                            </svg>
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