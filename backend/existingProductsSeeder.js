import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const productsFromWordpressDatabase = [
  {
    name: "Teipe Scotch Super 33+",
    description: `Destacado: Aplicación: Bajas tensiones. Color: Negro. Material: Cloruro de polivinilo. Rango de temperatura de operación: 32°F A 220°F. Uso: todo tipo de empalmes. Marca: 3M. La cinta Scotch Super 33+ es una cinta aislante de vinilo fabricada por 3M. Esta cinta es ampliamente utilizada para aplicaciones de aislamiento eléctrico en cables y conexiones de baja tensión. Aislamiento eléctrico: La cinta Scotch Super 33+ ofrece un buen nivel de aislamiento eléctrico, lo que la hace adecuada para proteger cables y conexiones en aplicaciones de baja tensión, como en sistemas eléctricos residenciales, comerciales e industriales. Adhesión duradera: Esta cinta cuenta con un adhesivo sensible a la presión que se adhiere de manera segura y duradera a una amplia variedad de superficies, como plástico, metal y caucho. Resistencia a la humedad y el envejecimiento: La cinta Scotch Super 33+ es resistente a la humedad, lo que la hace adecuada para aplicaciones en entornos húmedos o expuestos a la intemperie. Flexibilidad y conformabilidad: La cinta es flexible y fácil de manejar, lo que permite su aplicación en cables y conexiones de diferentes formas y tamaños. Cumplimiento de estándares: La cinta Scotch Super 33+ cumple con varios estándares de la industria, como UL y CSA.`,
    price: 8,
    category: "Electricidad, Ferretería en General",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005227.png",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: 'Disco de corte Extra fino 3W 7" 1/16 x 7/8 C/R',
    description:
      "This product lacks a detailed description. Please refer to the product name and category for an idea of its use and application.",
    price: 1.2,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005253.png",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Electrodo De Tungsteno 1/8 punta roja WeldTech",
    description:
      "This product lacks a detailed description. Please refer to the product name and category for an idea of its use and application.",
    price: 5.88,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005344.png",
    brand: "WeldTech",
    countInStock: 100,
  },
  {
    name: "Esmeril angular GWS 850W 4 1/2 Bosch",
    description:
      "El esmeril angular Bosch GWS 850W de 4 1/2 pulgadas es una herramienta potente y confiable para cortar, desbastar y pulir diferentes materiales. Cuenta con un motor de alto rendimiento que asegura durabilidad y eficiencia en el trabajo. Su diseño compacto y ergonómico facilita su manejo y control, haciéndolo ideal para profesionales y aficionados al bricolaje.",
    price: 120,
    category: "Construcción, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005406.png",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: 'Disco de corte normal 7" x 1/8" x 7/8" 3W C/R',
    description:
      "Este disco de corte de 7 pulgadas x 1/8 pulgadas x 7/8 pulgadas de la marca 3W es ideal para cortes rápidos y precisos en una variedad de materiales. Fabricado con materiales de alta calidad, ofrece durabilidad y un rendimiento de corte excepcional. Es compatible con esmeriladoras angulares estándar y es adecuado para proyectos de construcción y renovación.",
    price: 1.4,
    category: "Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-19-005433.png",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Careta soldar fotosensible Weldtech modelo llamas",
    description:
      "La careta de soldar fotosensible Weldtech modelo llamas es una solución avanzada para la protección ocular y facial durante la soldadura. Equipada con un filtro de oscurecimiento automático, ajusta su nivel de oscurecimiento al detectar el arco de soldadura, protegiendo los ojos de la intensa luz. Ofrece ajustes de sensibilidad y retardo, es liviana, cómoda y adecuada para una amplia gama de aplicaciones de soldadura.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124059.png",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Electrodo Lincoln Gricon 33 6013 3/32",
    description:
      "El Electrodo 6013 GRICON 33 de Lincoln es ideal para soldadura de unión en aceros de bajo carbono, ofreciendo un arco muy estable con fácil encendido y reencendido. Presenta una escoria ligera de fácil remoción y cordones convexos de excelente acabado, siendo perfecto para aplicaciones en herrería, carpintería metálica, fabricación de estructuras livianas y más.",
    price: 5.5,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM.jpeg",
    brand: "Lincoln",
    countInStock: 100,
  },
  {
    name: "Electrodo de tungsteno 3/32 punta roja Weldtech",
    description:
      "El Electrodo de Tungsteno 3/32 con punta roja de Weldtech es diseñado para proporcionar una soldadura de alta calidad gracias a su excelente conductividad y durabilidad. Ideal para la soldadura TIG, este electrodo es capaz de soportar altas temperaturas sin contaminar la soldadura, haciéndolo perfecto para soldaduras precisas y limpias.",
    price: 3.5,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124143.png",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Teipe Scotch 23",
    description:
      "El Teipe Scotch 23 de 3M es una cinta aislante de alta tensión diseñada para proporcionar aislamiento eléctrico en aplicaciones de hasta 69 kV. Ofrece excelente aislamiento eléctrico, resistencia a la humedad y el envejecimiento, aplicabilidad en frío, flexibilidad y conformidad con estándares de la industria como ASTM, CSA y IEC.",
    price: 15,
    category: "Electricidad, Ferretería en General, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124220.png",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: 'Esmeril angular STGS7115 (710W) 4-1/2" Stanley',
    description:
      'El Esmeril angular STGS7115 de Stanley, con potencia de 710W y disco de 4-1/2", es ideal para trabajos de corte, desbaste y pulido en diversos materiales. Su diseño compacto y ergonómico facilita el manejo y control en operaciones prolongadas, mientras que su motor de alto rendimiento asegura resultados precisos y duraderos.',
    price: 90,
    category: "Construcción, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124250.png",
    brand: "Stanley",
    countInStock: 100,
  },
  {
    name: "Teipe eléctrico de vinilo -M Termflex165",
    description:
      "El Teipe eléctrico 3M 165 Temflex, utilizado en tareas de aislamiento eléctrico, protege cables y empalmes. Resistente a temperaturas de hasta 80 °C, es ideal para identificar y codificar cables y alambres gracias a su disponibilidad en diversos colores. Este teipe combina durabilidad con flexibilidad, ajustándose a una amplia gama de aplicaciones eléctricas.",
    price: 1.5,
    category: "Electricidad, Ferretería en General, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124315.png",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: "Punta P/Antorcha SAW45 PRO Trafimet S45",
    description:
      "La Punta P/Antorcha SAW45 PRO Trafimet S45, usada en la antorcha de soldadura SAW45 PRO, establece el contacto eléctrico con el alambre de soldadura. Esencial para una transferencia de corriente eficaz, esta punta de contacto es clave para soldaduras precisas y de alta calidad en aplicaciones industriales de soldadura por arco sumergido (SAW).",
    price: 3,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124333.png",
    brand: "Trafimet",
    countInStock: 100,
  },
  {
    name: "Electrodo corto S45 P/antorcha SAW45PRO Trafimet S45",
    description:
      "Este electrodo corto está diseñado específicamente para la antorcha S45, ofreciendo un desempeño excepcional en soldaduras manuales industriales y comerciales. Su diseño optimiza la transferencia de corriente para soldaduras más limpias y precisas, ideal para profesionales que buscan la máxima calidad en sus trabajos de soldadura.",
    price: 2.5,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/Screenshot-2023-10-20-124404.png",
    brand: "Trafimet",
    countInStock: 100,
  },
  {
    name: 'Electrodo Lincoln Gricon 29 6010 1/8"',
    description:
      'El electrodo Lincoln Gricon 29 6010 1/8" es un electrodo revestido diseñado para soldaduras de alta resistencia y baja aleación. Con una excelente deposición de metal, alta resistencia a la tracción y propiedades de impacto a bajas temperaturas, es ideal para estructuras metálicas, puentes, y maquinaria pesada.',
    price: 6.5,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/electr-1.jpg",
    brand: "Lincoln",
    countInStock: 100,
  },
  {
    name: "Electrodo Lincoln Gricon 33 6013 1/8",
    description:
      "El electrodo Lincoln Gricon 33 6013 1/8 es un electrodo revestido de alta resistencia para la soldadura de aceros de alta resistencia y baja aleación. Destacado por su alta deposición de metal, resistencia a la tracción y propiedades de impacto, es perfecto para construcciones metálicas, puentes y recipientes a presión.",
    price: 5.5,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM.jpeg",
    brand: "Lincoln",
    countInStock: 100,
  },
  {
    name: "Electrodo de Aluminio 4043 1/8 Fundente azul WeldTech",
    description:
      "Electrodo de aluminio aleacion AWS Al4043. Espesor 1/8 (3.2 mm), marca Hoffmanarc, viene en paquetes de 3Kg. El electrodo de aluminio 4043 es utilizado específicamente para la soldadura de aluminio y aleaciones de aluminio, ampliamente usado en aplicaciones industriales y de fabricación donde se requiere soldar componentes de aluminio. Compuesto principalmente de aluminio, contiene pequeñas cantidades de silicio y manganeso, mejorando las propiedades de soldabilidad y flujo.",
    price: 75,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-2.jpeg",
    brand: "WeldTech",
    countInStock: 100,
  },
  {
    name: "SWIRL RING S45 P/ ANTORCHA PLASMA",
    description:
      "La 'Swirl Ring' o anillo de vórtice es un componente de las antorchas de corte por plasma, como la S45. Forma parte de la boquilla y juega un papel crucial en la generación del arco de plasma y el control del flujo de gas, asegurando un corte preciso y eficiente.",
    price: 14,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/s45-swirl-rign.jpg",
    brand: "Genérico",
    countInStock: 100,
  },
  {
    name: "TOBERA P/ ANTORCHA PLASMA T/ TRAFIMET S45 FLAMMER",
    description:
      "La tobera para antorcha de plasma modelo S45 Flammer de Trafimet es fundamental en el extremo frontal de la antorcha, facilitando el corte por plasma mediante la focalización y dirección del arco de plasma para cortes limpios y precisos en una variedad de materiales.",
    price: 15,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/PC0116-1024x1024.jpg.webp",
    brand: "Trafimet",
    countInStock: 100,
  },
  {
    name: "ESPACIADOR P/ ANTORCHA PLASMA S45 TRAFIMET",
    description:
      "Espaciador diseñado para su uso con la antorcha de corte por plasma S45 de la marca Trafimet. Este componente es esencial para mantener la distancia adecuada entre la antorcha y la pieza de trabajo, garantizando cortes precisos y de alta calidad.",
    price: 20,
    category:
      "Construcción, Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/CV0024-1024x1024.jpg.webp",
    brand: "Trafimet",
    countInStock: 100,
  },
  {
    name: "Maquina Cortadora De Plasma Saw 45amp. Ac En 220v 50hz Marca Hoffman Arc",
    description:
      "Máquina cortadora de plasma con capacidad de corte máximo de 19 mm. Cuenta con control de amperaje y voltaje para ajustar la intensidad del arco de plasma, sistema de arranque fácil, protección contra sobrecalentamiento y sobrecorriente, diseño compacto y portátil, y una interfaz de usuario intuitiva.",
    price: 820,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.03-AM-2.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Maquina Cortadora De Plasma Saw 40amp Monofasica En 220v Marca Hoffman Arc",
    description:
      "Máquina de plasma SAW 40PRO diseñada para cortar materiales de hasta aproximadamente 12 mm. Cuenta con una corriente de salida de hasta 40 amperios, es compacta y portátil, tiene una interfaz de usuario sencilla, y ofrece protección contra sobrecalentamiento, sobrecarga, y cortocircuitos.",
    price: 550,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.03-AM-1.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Maquina De Soldar Tig Voltarc 200pro Dc Ref.402-102 Marca Hoffman Arc",
    description:
      "Máquina de soldadura TIG con 200 amp, ideal para aplicaciones industriales. Ofrece un arranque fácil y rápido, control de amperaje y voltaje para ajustes precisos, y protección contra sobrecalentamiento. Su diseño compacto y portátil facilita el transporte.",
    price: 490,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.02-AM.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Maquina De Soldar Voltarc 200pro Ac/Dc Ref.402-205 Marca Hoffman Arc",
    description:
      "Máquina de soldar TIG AC/DC con capacidad para soldar aluminio y aceros en modo AC, y aceros y otros metales en modo DC. Ofrece alta resistencia a la corrosión y soldaduras de alta calidad para aplicaciones industriales y de construcción.",
    price: 1140,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.03-AM-6.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo 6010 De 1/8" Marca Hoffman Arc Ref. 6001002',
    description:
      'Electrodo 6010 de 1/8", ideal para soldadura por arco en aplicaciones estructurales. Proporciona un arco estable, capacidad para manejar la suciedad y la oxidación, y es utilizado en la construcción y fabricación de aceros al carbono.',
    price: 4.6,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.03-AM-2.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo 7018 1/8" Marca Hoffman Arc Ref. 6001802',
    description:
      'Electrodo 7018 de 1/8", reconocido por su alta calidad de soldadura y producción de juntas limpias y de alta resistencia. Adecuado para soldar aceros de baja y media aleación y aceros al carbono estructurales.',
    price: 4.3,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/electrodos-grises-4-1024x1024.jpg.webp",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Para Acero Inoxidable E308l-16 3/32" Marca Hoffman Arc Ref. 6003801',
    description:
      'Electrodo E308L-16 de 3/32", diseñado para soldar acero inoxidable tipo 304 y 304L. Ofrece alta resistencia a la corrosión y soldaduras de alta calidad, ideal para aplicaciones que requieren durabilidad y resistencia a la corrosión.',
    price: 20,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-8.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Para Acero Inoxidable E308l-16 1/8" Marca Hoffman Arc Ref. 6003802',
    description:
      'Electrodo E308L-16 de 1/8", específicamente para soldadura de acero inoxidable 304 y 304L. Proporciona soldaduras de alta calidad con excelente resistencia a la corrosión, adecuado para industrias química, alimentaria y de procesamiento de alimentos.',
    price: 20,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-8.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Máquina De Soldar Tig Voltarc 200pro Dc Ref.402-102 Marca Hoffman Arc",
    description:
      "Máquina de soldador Tig 200 apm, su frecuencia de conmutación va más allá del rango de audio, casi eliminando la contaminación acústica, cuenta con inicio Easy Arc. La frecuencia es de 20 Khz, lo que reduce el volumen y el peso de la máquina soldadora, gran reducción en la pérdida de resistencia magnética, mejorando la eficiencia de la soldadora y el efecto de ahorro de energía.",
    price: 490,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.02-AM.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Máquina De Soldar Voltarc 200pro Ac/Dc Ref.402-205 Marca Hoffman Arc",
    description:
      "La 'Máquina de Soldar Voltarc 200PRO AC/DC Ref. 402-205' de la marca Hoffman Arc es un modelo que combina las capacidades de soldadura AC (Corriente Alterna) y DC (Corriente Continua). Esto significa que puedes utilizarla tanto para soldar materiales de aluminio y aleaciones en modo AC, como para soldar aceros y otros metales en modo DC. Las máquinas de soldar TIG AC/DC son especialmente versátiles, ya que permiten adaptarse a una amplia gama de aplicaciones y materiales. El modo AC es necesario para soldar aluminio y sus aleaciones, ya que ayuda a limpiar la capa de óxido superficial y proporciona una mejor penetración en el material. Por otro lado, el modo DC es adecuado para soldar aceros, acero inoxidable, cobre, titanio y otros metales.",
    price: 1140,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.03-AM-6.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo 6010 De 1/8" Marca Hoffman Arc Ref. 6001002',
    description:
      "El electrodo 6010 es un tipo de electrodo de soldadura utilizado comúnmente en aplicaciones de soldadura por arco. Es un electrodo revestido con un revestimiento especial que proporciona propiedades específicas durante el proceso de soldadura. El electrodo 6010 pertenece a la clasificación de electrodos de acero al carbono con revestimiento celulósico. Este tipo de electrodo se caracteriza por su capacidad de penetración profunda, lo que lo hace adecuado para soldar en posición vertical y en aplicaciones donde se requiere una penetración profunda en el metal base. El electrodo 6010 es conocido por su arco estable y su capacidad para manejar la suciedad, la escoria y la oxidación en la superficie del metal base. Es ampliamente utilizado en la industria de la construcción y la fabricación, especialmente para soldar aceros al carbono en aplicaciones estructurales.",
    price: 4.6,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.03-AM-2.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo 7018 1/8" Marca Hoffman Arc Ref. 6001802',
    description:
      "El electrodo 7018 es otro tipo de electrodo de soldadura ampliamente utilizado en aplicaciones industriales y de construcción. Se clasifica como un electrodo de acero al carbono revestido con un revestimiento de baja hidrógeno. El electrodo 7018 es conocido por su alta calidad de soldadura y su capacidad para producir juntas de soldadura limpias y de alta resistencia. Se utiliza comúnmente para soldar aceros de baja y media aleación, aceros al carbono estructurales y otros materiales similares. Una de las principales características del electrodo 7018 es su revestimiento de baja hidrógeno. Este revestimiento ayuda a reducir la cantidad de hidrógeno presente en la soldadura, lo que a su vez minimiza el riesgo de fisuras y fallas por fragilidad en la unión soldada. Esto lo hace especialmente adecuado para aplicaciones donde se requiere una alta resistencia y durabilidad, como en la fabricación de estructuras metálicas, recipientes a presión, tuberías y equipos pesados. El electrodo 7018 se puede utilizar en diferentes posiciones de soldadura, incluyendo vertical, horizontal y sobrecabeza. Además, se caracteriza por tener un arco estable y una escoria fácil de remover, lo que facilita su manejo y operación.",
    price: 4.3,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/electrodos-grises-4-1024x1024.jpg.webp",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Para Acero Inoxidable E308l-16 3/32" Marca Hoffman Arc Ref. 6003801',
    description:
      'El electrodo E308L-16 es un tipo de electrodo de soldadura utilizado específicamente para soldar acero inoxidable del tipo 304 y 304L. Está diseñado para proporcionar una alta resistencia a la corrosión y una unión de soldadura de alta calidad en aceros inoxidables austeníticos. El "E" en la designación del electrodo (E308L) indica que es un electrodo para soldadura por arco con revestimiento. El "308" se refiere al tipo de acero inoxidable que se puede soldar con este electrodo, en este caso, acero inoxidable austenítico como el tipo 304 y 304L. El "L" indica que el electrodo contiene un bajo nivel de carbono para minimizar la formación de carburos y reducir el riesgo de corrosión intergranular en la zona afectada por el calor. El electrodo E308L-16 se utiliza generalmente en aplicaciones donde se requiere una alta resistencia a la corrosión, como en la fabricación de equipos y estructuras de acero inoxidable en la industria química, farmacéutica, alimentaria y de procesamiento de alimentos. También se utiliza en la reparación y mantenimiento de componentes de acero inoxidable.',
    price: 20,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-8.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Para Acero Inoxidable E308l-16 1/8" Marca Hoffman Arc Ref. 6003802',
    description:
      'El electrodo E308L-16 es un tipo de electrodo de soldadura utilizado específicamente para soldar acero inoxidable del tipo 304 y 304L. Está diseñado para proporcionar una alta resistencia a la corrosión y una unión de soldadura de alta calidad en aceros inoxidables austeníticos. El "E" en la designación del electrodo (E308L) indica que es un electrodo para soldadura por arco con revestimiento. El "308" se refiere al tipo de acero inoxidable que se puede soldar con este electrodo, en este caso, acero inoxidable austenítico como el tipo 304 y 304L. El "L" indica que el electrodo contiene un bajo nivel de carbono para minimizar la formación de carburos y reducir el riesgo de corrosión intergranular en la zona afectada por el calor. El electrodo E308L-16 se utiliza generalmente en aplicaciones donde se requiere una alta resistencia a la corrosión, como en la fabricación de equipos y estructuras de acero inoxidable en la industria química, farmacéutica, alimentaria y de procesamiento de alimentos. También se utiliza en la reparación y mantenimiento de componentes de acero inoxidable.',
    price: 20,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-8.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Máquina de Soldar Alumarc 200 PRO Marca Hoffmanarc ref: 402-216",
    description:
      "Máquina TIG Pulsada AC/DC 200 Amp. Inversor Monofásica. Adopta la tecnología de suministro de potencia de conmutación del inversor, reduciendo el volumen y peso de la máquina, mejorando la eficiencia de conversión. Puede soldar electrodos en acero al carbono, acero inoxidable, aluminio y demás. En proceso TIG, su característica principal es la soldadura de aluminio con corriente alterna de alta frecuencia (CA HF).",
    price: 1380,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/402-216-1024x1024.jpg.webp",
    brand: "Hoffmanarc",
    countInStock: 100,
  },
  {
    name: 'Esmeril Angular 7" 2.200 W 8.500 Rpm Ref. Gws 2200-180 Marca Bosch Cod. 527031',
    description:
      "El esmeril angular Bosch GWS 2200-180 es una herramienta eléctrica utilizada para trabajos de corte, desbaste y pulido en diversos materiales. Cuenta con un tamaño de disco de 7 pulgadas (180 mm), una potencia de 2.200 vatios, y una velocidad de 8.500 revoluciones por minuto (RPM), lo que determina la velocidad a la que gira el disco abrasivo durante el funcionamiento. Pertenece a la reconocida marca Bosch, conocida por fabricar herramientas eléctricas de alta calidad y durabilidad.",
    price: 200,
    category: "Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ESM-BOS-GWS2200-180_bc5d051a-f167-46f6-94e4-c1950e390c55_500x.webp",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: 'Tronzadora De Metal 14" 2.200 W 3800 Rpm Ref. Gco-220 Marca Bosch',
    description:
      "La tronzadora de metal Bosch GCO-220 es una herramienta eléctrica utilizada para cortar metales y otros materiales duros. Utiliza un disco de corte de 14 pulgadas (355 mm), tiene una potencia de 2.200 vatios, y una velocidad de 3.800 revoluciones por minuto (RPM), lo que determina la velocidad a la que gira el disco de corte durante el funcionamiento. Pertenece a la marca Bosch, conocida por su calidad y durabilidad en la fabricación de herramientas eléctricas.",
    price: 290,
    category: "Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.15-AM-4.jpeg",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: 'Disco de desbaste 7″x 1/4" x 7/8" Marca 3W',
    description:
      "Un disco de desbaste utilizado para operaciones de desbaste en metales. Este disco mide 7 pulgadas de diámetro, 1/4 de pulgada de grosor, y tiene un orificio central de 7/8 de pulgada para su montaje en diversas máquinas. Fabricado por 3W, es conocido por su durabilidad y capacidad para manejar tareas de desbaste pesado en una variedad de materiales metálicos.",
    price: 2.3,
    category: "Abrasivos, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM-1.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Disco de Corte 4 1/2″x.045″x7/8″ Ultrafino despresado marca 3W",
    description:
      "Un disco de corte ultrafino con centro rebajado, diseñado para cortes precisos y limpios con una mínima pérdida de material. Tiene un diámetro de 4 1/2 pulgadas, un espesor de .045 pulgadas, y un orificio central de 7/8 de pulgada, ajustable a la mayoría de las amoladoras angulares. Ideal para cortar metales como acero, acero inoxidable, aluminio, así como plástico y madera. Fabricado por 3W.",
    price: 0.8,
    category: "Abrasivos, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/D_NQ_NP_608811-MLV69113907566_042023-O.webp",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Regulador de Oxigeno medicinal C/Flujometro y vaso humificador Weldtech",
    description:
      "Regulador de Oxigeno Medicinal de 0-15 Lpm marca Weldtech. Es un dispositivo diseñado para controlar la entrega de oxígeno a pacientes, proporcionando una regulación precisa del flujo de oxígeno mediante un flujómetro, y cuenta con un vaso humidificador para asegurar que el oxígeno entregado esté adecuadamente humidificado para el confort del paciente.",
    price: 55,
    category: "Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-2.43.03-PM-1.jpeg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Regulador de Oxigeno T/Victor 350 marca Weldtech",
    description:
      "Regulador de oxígeno de tipo Victor 350, marca Weldtech, diseñado para regular y controlar el flujo de oxígeno desde un cilindro a equipos de soldadura o dispositivos médicos, garantizando un flujo constante y seguro de oxígeno a la presión deseada.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-24-at-10.27.53-AM.jpeg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: 'Disco Abras. C/Metal 4 1/2" X 1/8" X 7/8" C/Reb Ref. Dw-44604 Marca Dewalt',
    description:
      "Disco abrasivo para metal de 4 1/2 pulgadas de diámetro, 1/8 de pulgada de grosor y 7/8 de pulgada de agujero central, con centro rebajado, ref. DW-44604, marca Dewalt. Diseñado para cortar y desbastar metales ferrosos y no ferrosos, como acero, hierro, y aluminio, ofreciendo cortes rápidos, precisos y una larga vida útil.",
    price: 3,
    category: "Abrasivos, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/DIS-DEW-DW44604_029895a6-6f0a-4412-b986-725714c87d3d_500x-1.webp",
    brand: "Dewalt",
    countInStock: 100,
  },
  {
    name: "Regulador de Acetileno/Propano T/ Victor 350 Weldtech",
    description:
      "Regulador de acetileno/propano de tipo Victor 350, marca Weldtech, adecuado para ajustar y controlar la presión y el flujo de gases como acetileno o propano desde un cilindro hacia equipos de soldadura oxicombustible, proporcionando un rendimiento óptimo y seguridad en aplicaciones de soldadura y corte.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001102-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Regulador de argon C/Flujometro Marca Weldtech ref:  2001105",
    description:
      "Regulador de argón con flujómetro, marca Weldtech, ref. 2001105. Esencial para la soldadura TIG y MIG, permite un control preciso del flujo de argón necesario para proteger la zona de soldadura del contacto con el aire, asegurando soldaduras de alta calidad, libres de oxidación y contaminación.",
    price: 60,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/0700-1105.jpg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Regulador de helio Weldtech Ref  2001106",
    description:
      "Regulador de helio para globos, marca Weldtech, Ref. 2001106. Diseñado específicamente para el llenado de globos con helio, este regulador ajusta el flujo del gas para un inflado eficiente y seguro, asegurando que los globos sean llenados a la presión adecuada para maximizar la flotabilidad y la durabilidad.",
    price: 50,
    category: "Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001106-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Maquina De Soldar Lassen Dc 250amp Monofasico Ac En 220v 50hz Marca Hoffman Arc Ref.401-110",
    description:
      "Máquina de soldar inversor monofásico Lassen DC 250 amp, marca Hoffman Arc, ref. 401-110. Ideal para soldadura de alta precisión en acero al carbono, acero inoxidable y aluminio. Con tecnología de inversor avanzada, ofrece un rendimiento estable, eficiencia energética y facilidad de uso en una amplia gama de aplicaciones de soldadura.",
    price: 520,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.02-AM-1.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Varilla de aporte aluminio ER-4043 3/32×36″ hoffman arc.",
    description:
      "Varilla de aporte de aluminio ER-4043 de 3/32 pulgadas por 36 pulgadas, marca Hoffman Arc. Ideal para soldadura TIG de aluminio y sus aleaciones, ofrece excelente fluidez y resistencia a la formación de fisuras, adecuada para una amplia gama de aplicaciones de soldadura.",
    price: 25,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/6004302-1024x1024.jpg.webp",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Gel decapante WhaleSpray WS3610",
    description:
      "Gel decapante WS 3610 de WhaleSpray, diseñado para eliminar el ennegrecimiento y manchas de óxido en aceros inoxidables y sus aleaciones. Ofrece rápida acción decapante, excelente adhesión incluso en superficies verticales, sin riesgo de picado por ausencia de ácido clorhídrico. Su color rojo facilita la visualización durante la aplicación y previene accidentes.",
    price: 65,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/gel-decapante-ws3610g-bote-12-kgs.jpg",
    brand: "WhaleSpray",
    countInStock: 100,
  },
  {
    name: "Lentes / Anteojos De Seguridad Oscuro Modelo Virtua Mod. 11815 Marca 3M",
    description:
      "Lentes de seguridad oscuros modelo Virtua Mod. 11815, marca 3M. Ligeros y elegantes, ofrecen protección contra impactos, partículas voladoras, salpicaduras y radiación UV. Con lentes oscuros para reducir el brillo, son ideales para trabajos al aire libre y en entornos luminosos. Cumplen con estándares de resistencia al impacto.",
    price: 4,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.46-AM.jpeg",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: "Lentes de seguridad 3M Virtua 11819-00000-20 Policarbonato",
    description:
      "Lentes de seguridad 3M Virtua 11819-00000-20, de policarbonato transparente. Ofrecen resistencia a impactos, rasguños y protección UV. Con un diseño de marco envolvente, son unisex y proporcionan una visibilidad clara con 99.9% de protección UV y 85% de transmisión de luz visual. Incluyen protectores laterales.",
    price: 4,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.45-AM-1.jpeg",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: "Extintor de incendios para vehiculo 2.5 lbs",
    description:
      "Extintor de incendios portátil de 2.5 lbs, ideal para vehículos. Contiene agentes químicos secos para apagar incendios de clases A, B y C, proporcionando una solución eficaz para incendios incipientes. Compacto y ligero, es fácil de manejar y transportar, recomendado para cocinas, garajes, embarcaciones y vehículos recreativos.",
    price: 17,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/extintor-25.jpg",
    brand: "Generic",
    countInStock: 100,
  },
  {
    name: "Extintor de incendios 5 lbs con Base para soporte",
    description:
      "Extintor de incendios de 5 lbs con base para soporte, adecuado para uso en oficinas, talleres, y residencias. Contiene polvo químico seco ABC para clases A, B, y C de fuegos, incluyendo combustibles sólidos, líquidos inflamables, y equipos eléctricos. Viene con una base para facilitar su instalación y acceso rápido en caso de emergencia.",
    price: 25,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/extintor-5-1.jpg",
    brand: "Generic",
    countInStock: 100,
  },
  {
    name: "Extintor de incendios 10 lbs",
    description:
      "Extintor de incendios de 10 libras para combate de incendios de mediana a grande escala. Ideal para áreas amplias como almacenes, fábricas, y centros comerciales. Utiliza polvo químico seco ABC para fuegos de clases A, B, y C, ofreciendo una solución versátil y eficaz. Requiere mantenimiento regular para asegurar su funcionamiento óptimo.",
    price: 35,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/extintor-10.png",
    brand: "Generic",
    countInStock: 100,
  },
  {
    name: "Careta soldar Electronica fotosensible Weldtech modelo Aguila",
    description:
      "Careta de soldar fotosensible modelo Aguila de Weldtech, con filtro de oscurecimiento automático. Ofrece protección contra rayos UV/IR y ajustes de sensibilidad y tiempo de retardo. Diseñada para comodidad y ergonomía, es ideal para diversos procesos de soldadura. Requiere mantenimiento regular para óptimo rendimiento.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002171-1024x1024-1.jpg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Careta soldar Electronica fotosensible Weldtech modelo Ironman",
    description:
      "Careta de soldar fotosensible modelo Ironman de Weldtech, equipada con tecnología de oscurecimiento automático. Brinda protección UV/IR y permite ajustes personalizados. Ligera y cómoda, es perfecta para TIG, MIG, SAW y más. Mantenimiento regular recomendado para asegurar su funcionalidad.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002174-1536x1536-1.jpg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Careta soldar Electronica fotosensible Weldtech modelo llamas caravela",
    description:
      "Careta de soldar electrónica fotosensible modelo llamas caravela de Weldtech. Con filtro de oscurecimiento automático que se ajusta al detectar el arco de soldadura, ofrece protección UV/IR. Ajustable para diferentes necesidades, proporciona comodidad y reduce la fatiga. Ideal para todo tipo de soldadura.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002170-1024x1024-1.jpg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Careta soldar Electronica fotosensible Weldtech modelo Monster",
    description:
      "Careta de soldar fotosensible modelo Monster de Weldtech, con tecnología avanzada de filtro automático para protección UV/IR. Ajustable y ergonómica, es ideal para una amplia gama de procesos de soldadura. Requiere mantenimiento regular para mantener el rendimiento y prolongar la vida útil.",
    price: 55,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002175-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Alambre Mig Para Soldar Acero Al Carbon .035¨ 0.9 Mm 15 Kg Ref. Er70s-6 Marca Weldtech",
    description:
      "Alambre MIG ER70S-6 de 0.035 pulgadas (0.9 mm), 15 kg, para soldar acero al carbono. Compatible con soldadura MIG, ofrece excelentes propiedades mecánicas y mínima porosidad. Ideal para estructuras metálicas, reparación de vehículos y más. Fabricado por Weldtech, garantiza calidad y eficiencia.",
    price: 65,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER70S-6-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Alambre Mig Para Soldar Acero Al Carbon .045¨ 1.2 Mm 15 Kg Ref. Er70s-6 Marca Weldtech",
    description:
      'Alambre MIG ER70S-6 de 0.045" (1.2 mm), 15 kg, para soldar acero al carbono. Ideal para soldadura MIG/GMAW, ofrece excelentes propiedades mecánicas y es versátil para diferentes posiciones de soldadura. Compuesto por acero de bajo contenido de carbono con adiciones de manganeso y silicio.',
    price: 65,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER70S-6-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Alambre Mig Para Soldar Acero Al Carbon .035¨ 0.9 Mm 5 Kg Ref. Er70s-6-0-95 / 377090 Marca Weldtech",
    description:
      'Alambre MIG ER70S-6-0-95 / 377090 de 0.035" (0.9 mm), 5 kg, para soldadura de acero al carbono. Adecuado para espesores medios a delgados, ofrece alta calidad de soldadura con mínima porosidad. Utiliza gas de protección para un cordón limpio y libre de contaminación.',
    price: 22,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER70S-6-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Alambre Mig Para Soldar Acero Al Carbon .030¨ 0.8 Mm 5 Kg Ref. Er70s-6-0-85 / 710830 Marca Weldtech",
    description:
      'Alambre MIG ER70S-6-0-85 / 710830 de 0.030" (0.8 mm), 5 kg, para soldadura de acero al carbono. Diseñado para precisión en soldaduras de espesor delgado, optimiza el uso de gas protector. Su composición asegura soldaduras fuertes y resistentes con excelente acabado.',
    price: 22,
    category: "Construcción, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER70S-6-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: 'Electrodo 6013 3/32" Marca Hoffman Arc.',
    description:
      'Electrodo 6013 de 3/32", ideal para soldaduras de espesor medio a delgado en SMAW. Con revestimiento especial para un arco estable y protección contra la contaminación, es versátil para diversas aplicaciones, ofreciendo facilidad de uso y buena manejabilidad.',
    price: 3,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-1.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Stark 6013 1/8" Marca Hoffman Arc',
    description:
      'Electrodo Stark 6013 de 1/8", adecuado para soldaduras estructurales y generales en SMAW. Ofrece excelentes propiedades de soldadura, con un revestimiento que asegura soldaduras de alta calidad. Ideal para aceros suaves y de baja aleación en construcción y reparación.',
    price: 3,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-1.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: 'Electrodo Sinnvol 7018 1/8" Marca Hoffman Arc',
    description:
      'Electrodo 7018 de 1/8", especializado en soldaduras de alta resistencia y estructurales. Su revestimiento promueve soldaduras de calidad, con baja porosidad. Utilizado en construcción de puentes, estructuras metálicas y más. Fabricado por Hoffman Arc, garantiza calidad y eficiencia.',
    price: 4.3,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.04-AM-1.jpeg",
    brand: "Hoffman Arc",
    countInStock: 100,
  },
  {
    name: "Maquina De Soldar Inverter 200amp 120/220v Lince + 5 kg de electrodo",
    description:
      "Máquina de soldar Inverter Lince, 200amp, 120/220V. Tecnología inverter para mayor eficiencia y control, adecuada para soldar acero suave, acero inoxidable y más. Compacta y ligera para fácil transporte. Incluye 5 kg de electrodos para diversos proyectos de soldadura.",
    price: 250,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.35.02-AM-2.jpeg",
    brand: "Lince",
    countInStock: 100,
  },
  {
    name: "Pinza de Tierra 500amp T/Lenco Weldtech",
    description:
      "Pinza de Tierra EG-500 t/ Lenco de 500 Amp, marca Weldtech. Fabricada en latón para máxima durabilidad y eficiencia en la conducción. Diseñada para sujeción segura y estable en trabajos de soldadura de alta demanda.",
    price: 9,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2003701-1024x1024.jpg-1.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Pinza Porta Electrodo 300 Amp Trabajo Pesado Tipo Lenco Marca Weldtech Ref. 2003600",
    description:
      "Pinza Porta Electrodo de 300 Amp para trabajo pesado, Tipo Lenco, marca Weldtech Ref. 2003600. Ideal para una amplia variedad de aplicaciones de soldadura, garantizando un agarre firme y seguro del electrodo durante el proceso de soldadura.",
    price: 16,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2003600-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Pinza Porta Electrodo de 500 AMP Tipo Lenco AF50 Weldtech",
    description:
      "Pinza Porta Electrodo de 500 Amp, tipo Lenco AF50 para trabajo pesado, marca Weldtech. Diseñada para ofrecer un agarre seguro y firme del electrodo, ideal para aplicaciones de soldadura exigentes. Aislantes resistentes a la flama y trato rudo.",
    price: 24,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2003601-1-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: 'Disco de tronzadora de 14" pulgadas 3w',
    description:
      "Disco de tronzadora DCT-14-3W, 14 mm, marca 3W. Diseñado para cortar metal, este disco robusto y duradero es esencial para trabajos de corte exigentes. Su composición asegura cortes precisos y rápidos, optimizando el rendimiento en cada uso.",
    price: 4.5,
    category:
      "Abrasivos, Construcción, Ferretería en General, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/D_NQ_NP_971708-MLV47484188893_092021-O.webp",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Cepillo de Copa A/C 5 X 5/8 0,50MM Strugger",
    description:
      "Cepillo de Copa de acero con espesor de 0,50 mm, 5 X 5/8, marca Strugger. Perfecto para trabajos de desbaste y acabado en superficies metálicas. Diseñado para uso con herramientas de potencia, ofrece un rendimiento excepcional en la limpieza, preparación de superficies y remoción de pintura o óxido.",
    price: 15,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/8003201-1024x1024.jpg.webp",
    brand: "Strugger",
    countInStock: 100,
  },
  {
    name: 'Cepillo de Copa A/C 4" X 5/8 0,50MM Strugger',
    description:
      "Herramienta de 4 pulgadas de diámetro para desbaste y acabado, con alambres de acero de 0,50 mm de espesor. Compatible con herramientas de mandril de 5/8 de pulgada. Ideal para una variedad de aplicaciones de limpieza y preparación de superficies.",
    price: 11,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/8003201-1024x1024.jpg.webp",
    brand: "Strugger",
    countInStock: 100,
  },
  {
    name: "Cepillo de Alambre A/C 4″X5/8″ 0,30MM Strugger",
    description:
      "Cepillo de alambre de 4 pulgadas con alambres de 0,30 mm de espesor para tareas de limpieza y acabado suaves. Compatible con herramientas de mandril de 5/8 de pulgada. Ideal para superficies sensibles que requieren un tratamiento cuidadoso.",
    price: 6,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/8003006-1024x1024.jpg.webp",
    brand: "Strugger",
    countInStock: 100,
  },
  {
    name: "Cepillo de Alambre A/C 5″X5/8″ 0,30MM Strugger",
    description:
      "Cepillo de alambre de 5 pulgadas con alambres delgados de 0,30 mm para limpieza y acabado. Adecuado para una acción menos agresiva en superficies que requieren cuidado. Compatible con herramientas de mandril de 5/8 de pulgada.",
    price: 6.5,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/8003006-1024x1024.jpg.webp",
    brand: "Strugger",
    countInStock: 100,
  },
  {
    name: "Vidrio P/ Careta de Soldar #12 Weldtech",
    description:
      "Vidrio de protección para careta de soldar #12 de Weldtech, ofrece un nivel de oscurecimiento alto para protección contra brillo y destellos durante la soldadura. Compatible con caretas de soldadura Weldtech.",
    price: 0.5,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002302-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Arrestador de llama P/ Antorcha Trabajo Pesado Weldtech",
    description:
      "Dispositivo de seguridad para antorchas de trabajo pesado, previene el retroceso de la llama, garantizando una operación segura. Esencial en soldadura y corte con gases combustibles.",
    price: 37,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2003303-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Arrestador de llama P/ Regulador Trabajo pesado Weldtech",
    description:
      "Dispositivo de seguridad para reguladores de gas, evita el retroceso de la llama, esencial para la seguridad en procesos de soldadura y corte. Compatible con reguladores de trabajo pesado.",
    price: 37,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/para-regular.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Arrestador de llama P/ Antorcha Weldtech",
    description:
      "Dispositivo de seguridad para antorchas de soldadura y corte Weldtech. Previene el retroceso de la llama para asegurar operaciones seguras. Instalación sencilla en la línea de combustible.",
    price: 17,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/p-antorcha-normal.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Arrestador de llama P/ Regulador Weldtech",
    description:
      "Dispositivo de seguridad para reguladores de gas marca Weldtech. Previene el retroceso de la llama, protegiendo contra accidentes durante la soldadura. Compatible con reguladores Weldtech.",
    price: 17,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/p-regulador-normal.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Guante de Carnaza corto T/pistola reforzado",
    description:
      "Guantes de carnaza cortos reforzados para protección en manejo de pistolas y herramientas. Ofrecen resistencia a la abrasión, calor y desgaste. Ajuste hasta la muñeca para mayor destreza.",
    price: 3.5,
    category: "Seguridad Industrial, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.28-AM.jpeg",
    brand: "Generic",
    countInStock: 100,
  },
  {
    name: "Equipo de oxicorte T/Harris Master II Weldtech Ref 2001001",
    description:
      "Completo equipo de oxicorte T/Harris Master II de Weldtech para cortar o soldar metales. Incluye antorcha de corte, reguladores de gas, cilindros y mangueras. Elementos de seguridad recomendados para su uso.",
    price: 220,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001001-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 1/4 X 12" 01 Piez Ref. 2001912 (Ref. Caja De 250pza) Marca Weldtech',
    description:
      'Electrodo especial para carbonización de acero, 1/4 x 12". Ideal para mejorar la resistencia a la corrosión del metal. Usado en procesos de carbonización superficial.',
    price: 0.4,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 5/16 X 12" 01 Piez Ref. 2001913 (Caja De 250pza) Weldtech',
    description:
      'Electrodo de 5/16 x 12" para carbonización, utilizado para agregar capa de carbón a acero, mejorando resistencia a corrosión. Compuesto por carbón, grafito y aditivos.',
    price: 0.4,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 3/8 X 12" 01 Piez Ref. 2001914 (Caja De 250pza) Weldtech',
    description:
      'Electrodo de 3/8" x 12" para carbonización, utilizado para agregar capa de carbón a acero, mejorando resistencia a corrosión. Compuesto por carbón, grafito y aditivos.',
    price: 0.78,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 1/8 X 12" 01 Piez Ref. 2001909 (Caja De 250pza) Weldtech',
    description:
      'Electrodo de 1/8" x 12" para carbonización, ideal para mejorar resistencia a corrosión del acero. Usado en procesos de carbonización superficial.',
    price: 0.25,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 5/32 X 12" 01 Piez Ref. 2001910 (Caja De 250pza) Weldtech',
    description:
      'Electrodo de 5/32" x 12" para carbonización, para agregar capa de carbón a acero y mejorar resistencia a la corrosión. Adecuado para una variedad de tamaños de piezas de acero.',
    price: 0.25,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Electrodo Esp. Para Carbonear De 3/16 X 12" 01 Piez Ref. 2001911 (Caja De 250pza) Weldtech',
    description:
      'Electrodo de 3/16" x 12" para carbonización, para mejorar la resistencia a la corrosión del acero con capa de carbono. Ideal para piezas de tamaño medio a grande.',
    price: 0.25,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2001913-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 250,
  },
  {
    name: 'Guante de carnaza largo 16" reforzado con matachispa',
    description:
      'Guantes de carnaza de 16" reforzados para protección en trabajos con riesgo de chispas. Proporcionan cobertura hasta el antebrazo, reforzados con material resistente al fuego.',
    price: 6.5,
    category: "Seguridad Industrial, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.28-AM-1.jpeg",
    brand: "Generic",
    countInStock: 100,
  },
  {
    name: "Lentes de seguridad anti-empanantes virtua CCS 3M 118720000020",
    description:
      "Gafas de seguridad 3M Virtua CCS con lentes antiempañantes para protección ocular en entornos laborales. Diseño ligero, cómodo y ajustable, ideal para prevenir lesiones oculares.",
    price: 16,
    category: "Seguridad Industrial, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.34.45-AM-2.jpeg",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: 'Disco Flap 4 1/2" x 7/8" Grano 40 3W',
    description:
      'Disco flap de 4 1/2" x 7/8" con grano 40 para desbaste y lijado en metal y madera. Compuesto por aletas abrasivas flexibles para un acabado uniforme.',
    price: 1,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM-2.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: 'Disco Flap 4 1/2" x 7/8" Grano 60 3W',
    description:
      'Disco flap de 4 1/2" x 7/8" con grano 60 para desbaste suave y preparación de superficies. Aletas flexibles para un lijado uniforme en metal y madera.',
    price: 1,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM-2.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: 'Disco Flap 4 1/2" x 7/8" Grano 80 3W',
    description:
      'Disco flap de 4 1/2" x 7/8" con grano 80 para acabado fino y lijado en diversos materiales. Diseño con aletas abrasivas para resultados suaves y uniformes.',
    price: 1,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM-2.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: 'Disco Flap 4 1/2" x 7/8" Grano 100 3W',
    description:
      'Disco flap de 4 1/2" x 7/8" con grano 100 para lijado y acabado muy fino en metal, madera y plástico. Aletas abrasivas flexibles para un acabado suave.',
    price: 1,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM-2.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Disco de Corte P/Metal Inox 4 1/2″x.045″x7/8″ Ultrafino plano 3W",
    description:
      'Disco de corte ultrafino plano de 4 1/2" x .045" x 7/8" para corte preciso en metal y acero inoxidable. Ideal para trabajos que requieren cortes limpios y precisos.',
    price: 0.8,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/D_NQ_NP_766157-MLV48307925758_112021-O.webp",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: 'Disco de corte P/Metal Inox 7" x 1/16" x 7/8" extrafino centro rebajado 3W',
    description:
      'Un disco de corte de 7" x 1/16" x 7/8" extrafino con centro rebajado es una herramienta abrasiva utilizada para realizar cortes precisos en diversos materiales. Aquí tienes información sobre las características de este disco:\n\n- Tamaño: El disco tiene un diámetro de 7" (aproximadamente 17.78 cm), un espesor de 1/16" (aproximadamente 1.59 mm) y un orificio de montaje de 7/8" (aproximadamente 2.22 cm). Estas dimensiones son comunes y se ajustan a la mayoría de las amoladoras angulares y herramientas de corte.\n\n- Extrafino: El término "extrafino" se refiere al espesor del disco, que es muy delgado. Este tipo de disco está diseñado para cortes precisos y limpios con una mínima pérdida de material.\n\n- Centro rebajado: El "centro rebajado" significa que el orificio central del disco tiene una forma especial que permite un ajuste adecuado en la amoladora angular. Esta característica permite que el disco se asiente correctamente en la herramienta y evita vibraciones o desequilibrios durante el corte.\n\n- Aplicaciones: Este disco de corte extrafino con centro rebajado se utiliza para cortar metales, acero inoxidable, aluminio, plástico y otros materiales. Es ideal para aplicaciones que requieren cortes precisos y una menor generación de calor, como trabajos de acabado, fabricación de metales y proyectos donde se desea minimizar la pérdida de material.',
    price: 1.2,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.25-AM-1.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: 'Disco de corte P/Metal inox 7" x 1/8" x 7/8" centro rebajado 3W',
    description:
      'Un disco de corte P/Metal inox de 7" x 1/8" x 7/8" con centro rebajado es una herramienta abrasiva diseñada específicamente para cortar metales y acero inoxidable.',
    price: 1.4,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.27-AM.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Disco de Corte P/Metal Inox 4 1/2″x.1/8″x7/8″ centro rebajado 3W",
    description:
      'Un disco de corte P/Metal Inox de 4 1/2" x 1/8" x 7/8" con centro rebajado es una herramienta abrasiva diseñada específicamente para cortar metales y acero inoxidable.',
    price: 0.8,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-23-at-10.33.24-AM-1-1.jpeg",
    brand: "3W",
    countInStock: 100,
  },
  {
    name: "Varilla de aporte TIG ER-70S6 3/32 X 36′ Weldtech",
    description:
      "La varilla de aporte TIG ER-70S6 de 3/32\" x 36' de Weldtech es un electrodo utilizado en el proceso de soldadura TIG (Tungsten Inert Gas).",
    price: 6,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2007022-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Varilla de aporte TIG ER-70S6 1/8 X 36′ Weldtech",
    description:
      "La varilla de aporte TIG ER-70S6 de 1/8\" x 36' de Weldtech es un electrodo utilizado en el proceso de soldadura TIG.",
    price: 6,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2007022-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: 'Varilla de aporte TIG aluminio ER-4043 1/8" ×36″ hoffmanarc',
    description:
      'La varilla de aporte TIG de aluminio ER-4043 de 1/8" x 36" de HoffmanArc es un electrodo para soldar aluminio.',
    price: 25,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/6004302-1024x1024.jpg.webp",
    brand: "HoffmanArc",
    countInStock: 100,
  },
  {
    name: "Varilla de aporte TIG acero inox ER308L-16 1/16 X 36¨ Oxford",
    description:
      'La varilla de aporte ER308L-16 1/16" x 36" de Oxford es una varilla para soldadura TIG en aceros inoxidables austeníticos del tipo 308L.',
    price: 35,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER-308-16-116-1-1024x1024.jpg.webp",
    brand: "Oxford",
    countInStock: 100,
  },
  {
    name: "Varilla de aporte TIG acero inox ER308L-16 3/32 X 36¨ Oxford",
    description:
      'La varilla de aporte TIG para acero inoxidable ER308L-16 de 3/32" x 36" de Oxford es un electrodo para soldar aceros inoxidables austeníticos del tipo 308L.',
    price: 35,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER-308-16-116-1-1024x1024.jpg.webp",
    brand: "Oxford",
    countInStock: 100,
  },
  {
    name: 'Varilla de aporte TIG acero inox ER308L-16 1/8" X 36¨ Oxford',
    description:
      'La varilla de aporte TIG para acero inoxidable ER308L-16 de 1/8" x 36" es una varilla común en la soldadura TIG para aceros inoxidables austeníticos del tipo 308L.',
    price: 35,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/ER-308-16-116-1-1024x1024.jpg.webp",
    brand: "Oxford",
    countInStock: 100,
  },
  {
    name: 'Varilla de Bronce 3/32" Weldtech',
    description:
      'La varilla de bronce de 3/32" de Weldtech se utiliza en soldadura de bronce y reparaciones de metales no ferrosos.',
    price: 45,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2007001-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Careta P/ Soldar Movil Weldtech",
    description:
      "Esta careta con vidrio móvil de Weldtech es de alta resistencia al calor y repela la salpicadura de la soldadura.",
    price: 5,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002100-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Bombillo portatil LED de emergencia 30W, recargable puerto usb",
    description:
      "Bombillo LED de emergencia portátil de 30W con recarga USB y múltiples intensidades de iluminación.",
    price: 10,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/10/BLEM03.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Bombillo Led de Emergencia 15W Rosca E27",
    description:
      "Bombillo LED de emergencia de 15W con rosca E27, recargable con DC 5V, incluye 2 baterías recargables de 1200 Mah.",
    price: 7,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/BLEM05C.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Lampara Led de Emergencia T5 recargable 15w",
    description:
      "Lampara LED de emergencia T5 recargable con capacidad de 15W, luz fría de 6500K, y batería recargable de 1800 Mah. Ofrece 3 niveles de intensidad y autonomía de 2 a 7 horas.",
    price: 5,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/LAEM15A.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Lampara Led de Emergencia T5 Recargable 30W",
    description:
      "Lampara LED de emergencia T5 recargable con capacidad de 30W, luz fría de 6500K, y batería recargable de 2000 Mah. Ofrece 3 niveles de intensidad y autonomía de 2 a 7 horas.",
    price: 8,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/LAEM-30A.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Lampara LED Solar Recargable 50W T/Reflector",
    description:
      "Lampara LED solar recargable con capacidad de 50W, luz fría de 6500K, y dos baterías recargables de 1800 Mah. Ofrece 4 intensidades de luz y autonomía de 6-26 horas.",
    price: 20,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/LAMLESOL01A.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Lampara Led redonda 18W Superficial",
    description:
      "Lampara LED redonda superficial de 18W, luz fría de 6500K, y 1500 Lumens. Ofrece alta eficiencia y ahorro energético.",
    price: 5.5,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/D_NQ_NP_958842-MLV70997071627_082023-O.webp",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Tomacorriente Doble Con Tierra 127-250V 10-16 AMP",
    description:
      "Tomacorriente doble con tierra, voltaje de 127-250V y corriente de 10-16A. Fabricado en material termoplástico de alta resistencia.",
    price: 2,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/10/INT08.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Interruptor Doble 125-250V 10-16 AMP INT02",
    description:
      "Interruptor doble para voltajes de 125-250V y corriente de 10-16A. Hecho de material termoplástico brillante y resistente.",
    price: 2,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/10/INT02.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Guante P/Soldador MIG 10 ” Weldtech",
    description:
      'Guante para soldador MIG de 10" diseñado para protección durante la soldadura, hecho de materiales resistentes al calor.',
    price: 14,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002240-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Guante P/Soldador TIG 10 ” Weldtech",
    description:
      'Guante para soldador TIG de 10", ofreciendo protección y comodidad con materiales resistentes al calor y la abrasión.',
    price: 14,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/10/2002245-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Tomacorriente superficial Doble Con Tierra 127-250V 15 AMP",
    description:
      "Tomacorriente superficial doble con tierra, para 127-250V y 15A. Hecho de material termoplástico resistente.",
    price: 2,
    category:
      "Ferretería en General, Hogar y Accesorios, Iluminación, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/10/TM03.jpg",
    brand: "Run",
    countInStock: 100,
  },
  {
    name: "Pico De Propano Tipo Harris Nro. 5 Ref. 0700-1605 Marca Perfectweld",
    description:
      "Pico de propano tipo Harris Nro. 5 para soldadura y corte con gas propano, ofreciendo un flujo estable y preciso.",
    price: 4,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/11/5.webp",
    brand: "Perfectweld",
    countInStock: 100,
  },
  {
    name: "Pico De Propano Tipo Harris Nro. 6 Ref. 0700-1606 Marca Perfectweld",
    description:
      "Pico de propano tipo Harris Nro. 6 diseñado para un flujo preciso de gas propano en soldadura y corte.",
    price: 4,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/11/5.webp",
    brand: "Perfectweld",
    countInStock: 100,
  },
  {
    name: "Pico De Propano Tipo Harris Nro. 4 Ref. 0700-1604 Marca Perfectweld",
    description:
      "Pico de propano tipo Harris Nro. 4 para equipos de soldadura y corte, garantizando calidad y rendimiento.",
    price: 4,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/11/5.webp",
    brand: "Perfectweld",
    countInStock: 100,
  },
  {
    name: "Liquido Penetrante Aerosol Magnaflux",
    description:
      "Liquido Emulsificador Penetrante Para Teñir De Color Rojo Aerosol De 16 Oz marca Magnaflux, utilizado en la inspección no destructiva para detectar defectos superficiales.",
    price: 45,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/penetrante.webp",
    brand: "Magnaflux",
    countInStock: 100,
  },
  {
    name: "Liquido Revelador Aerosol Magnaflux",
    description:
      "Líquido revelador en aerosol de Magnaflux para revelar las indicaciones de los líquidos penetrantes en procesos de inspección no destructiva.",
    price: 35,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/revelador.webp",
    brand: "Magnaflux",
    countInStock: 100,
  },
  {
    name: "Liquido Removedor Aerosol Magnaflux",
    description:
      "Líquido removedor en aerosol de Magnaflux para limpiar y eliminar residuos de líquidos penetrantes y reveladores en la inspección no destructiva.",
    price: 32,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/revelador.webp",
    brand: "Magnaflux",
    countInStock: 100,
  },
  {
    name: "DIFUSOR T/ BINZEL 36AK CORTO FLAMMER REF 142.0005",
    description:
      "Difusor T/Binzel 36AK corto Flammer para antorchas de soldadura MIG/MAG, diseñado para distribuir el flujo de gas protector.",
    price: 1.5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/difusor-tbinzel-36AK-corto.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "TOBERA 1/2 BINZEL 36AK FLAMMER",
    description:
      "Tobera 1/2 Binzel 36AK Flammer para antorchas de soldadura MIG/MAG, diseñada para dirigir el flujo de gas protector hacia la zona de soldadura.",
    price: 10,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/tobera-media-binzel-36AK.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Delantal de Carnaza para soldador",
    description:
      "Delantal de protección para soldador hecho de cuero de carnaza, resistente al calor, la abrasión y las llamas.",
    price: 10,
    category: "Seguridad Industrial, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/delantal.jpg",
    brand: "Sin Marca",
    countInStock: 100,
  },
  {
    name: "Chaleco completo Peto de Carnaza",
    description:
      "Chaleco de carnaza con mangas para protección en entornos de trabajo con riesgo de salpicaduras, chispas y calor.",
    price: 22,
    category: "Seguridad Industrial, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/chaleco-peto-de-carnaza.jpg",
    brand: "Genérico",
    countInStock: 100,
  },
  {
    name: "Antorcha Tig de 200 Amp WP-26FV252 tipo Weldcraft marca Flammer",
    description:
      "Antorcha Tig de 200 Amp WP-26FV252 tipo Weldcraft, marca Flammer, utilizada en procesos de soldadura TIG.",
    price: 160,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/2008090-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Contac Tip .045¨ (1.2mm) P/ Antorcha 36AK Binzel",
    description:
      "Contacto de punta .045¨ (1.2mm) para antorcha 36AK de Binzel, utilizado en soldadura MIG/MAG.",
    price: 1.6,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/140.0445-1024x1024.jpg-1.webp",
    brand: "Binzel",
    countInStock: 100,
  },
  {
    name: "Contac Tip .040¨ (0.9mm) P/ Antorcha 36AK Binzel",
    description:
      "Contacto de punta .040¨ (0.9mm) para antorcha 36AK de Binzel, utilizado en soldadura MIG/MAG.",
    price: 1.6,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/140.0445-1024x1024.jpg-1.webp",
    brand: "Binzel",
    countInStock: 100,
  },
  {
    name: "Antorcha Mig 300 Amp.Tipo Binzel 36AK Euro",
    description:
      "Antorcha Mig de 300 Amp, tipo Binzel 36AK Euro, para soldadura MIG/MAG con conexión tipo Euro.",
    price: 246,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/antorcha-36ak.webp",
    brand: "Binzel",
    countInStock: 100,
  },
  {
    name: "Contac Tip .030¨(0.8mm) t/ Binzel p/ Anotrchas 25/36AK Flammer",
    description:
      "Contacto de punta .030¨(0.8mm) para antorchas 25/36AK de Binzel, utilizado en soldadura MIG/MAG, fabricadas por Flammer.",
    price: 1.6,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/140.0051-2-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Tobera 1/2 Binzel 15/25AK Flammer",
    description:
      'Tobera de 1/2" para las antorchas Binzel T/EURO 15/25AK fabricadas por Flammer, diseñada para optimizar el flujo de gas protector.',
    price: 5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/TOBERA-BINZEL-25AK.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Tobera 5/8 t/ Binzel 25AK Flammer",
    description:
      'Tobera de 5/8" para la antorcha Binzel 25AK fabricada por Flammer, diseñada para un control preciso del flujo de gas protector.',
    price: 5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/TOBERA-BINZEL-25AK-1.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Liner t/ Binzel p Antorchas 15AK/25AK 1.0-1.2mm 5MT Flammer",
    description:
      "Liner para antorchas Binzel 15AK/25AK de 1.0-1.2 mm y 5 metros de longitud, fabricado por Flammer, para guiar el alambre de soldadura.",
    price: 8,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/LINER-BINZEL-25AK.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Contact Tip .035 ¨ (0.9 mm) t/ Binzel P/ Anotrcha 25AK Binzel",
    description:
      'Contact tip .035" (0.9 mm) tipo Binzel para antorcha modelo 25/36, diseñado para asegurar el flujo continuo de alambre de soldadura.',
    price: 1.6,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/140.0445-1024x1024.jpg-1.webp",
    brand: "Binzel",
    countInStock: 100,
  },
  {
    name: "Difusor para Antorcha Binzel 25AK marca Flammer",
    description:
      "Difusor para Antorcha Binzel AK25 marca Flammer, esencial para la distribución del flujo de gas en procesos de soldadura MIG/MAG.",
    price: 2,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/difusor-25ak.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Tobera cilindrica 5/8 t/ Binzel 15/25AK Flammer",
    description:
      'Tobera cilíndrica de 5/8" (16mm) para Antorcha Binzel 15/25AK marca Flammer, diseñada para mejorar el enfoque del gas protector.',
    price: 3.5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/145.0041-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Antorcha Mig 250 Amp. Tipo Binzel 25AK Euro",
    description:
      "Antorcha MIG de 250 amperios tipo Binzel modelo 25AK con conector euro, adecuada para un ciclo de trabajo del 60% en CO2 y mezcla de gases.",
    price: 140,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/25AK-2-1024x1024.jpg.webp",
    brand: "Binzel",
    countInStock: 100,
  },
  {
    name: 'Esmeril Dewalt 4.1/2" (850 Watts ) 7,5a Dwe4012',
    description:
      "Esmeril Angular DeWalt modelo DWE4012, de 850 Watts y 7.5A, con un disco de 4.5 pulgadas, diseñado para aplicaciones de corte y desbaste.",
    price: 165,
    category:
      "Construcción, Ferretería en General, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/esmeril-angular-dewalt-4-y-medio.jpg",
    brand: "DeWalt",
    countInStock: 100,
  },
  {
    name: 'Disco De Lija (Flap Disc) De 7" X 7/8" Grano 40 T29 Marca Strugger',
    description:
      "Disco de Lija (Flap Disc) para Metal 7″ X 7/8″ Grano 40 T29 marca Strugger, diseñado para aplicaciones de desbaste y acabado en metal.",
    price: 2.99,
    category: "Abrasivos, Construcción, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/flap-7-gr-40.webp",
    brand: "Strugger",
    countInStock: 100,
  },
  {
    name: "Electrodo corto 35 Amp p/ Anotrcha Saw 40 pro PT-31",
    description:
      "Electrodo de 35 Amp para Antorcha PT-31 tipo ESAB Marca Flammer, compatible con la Saw40 pro o la Cut 40.",
    price: 3,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/18205-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Punta 1.0 mm 30 Amp p/ Anotrcha PT-31 Esab Flammer",
    description:
      "Punta de 1.0 mm y 30 Amp para Antorcha PT-31 tipo ESAB Marca Flammer, compatible con la máquina Saw40 pro.",
    price: 1.5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/18866-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Porta Tobera 30/50 Amp p/ Anotrcha PT-31 Esab Flammer",
    description:
      "Porta Tobera para Antorcha PT-31 tipo ESAB Marca Flammer, esencial para el mantenimiento y la estabilidad del proceso de corte.",
    price: 0.6,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/18785-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Tobera p/ Antorcha PT-31 Esab Flammer",
    description:
      "Tobera para Antorcha PT-31 tipo ESAB Marca Flammer, compatible para máquina Saw 40 pro.",
    price: 2.5,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/20282-1024x1024.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Yesquero sencillo para soldador Weldtech C/ 5 piedras",
    description:
      "Yesquero sencillo para soldador marca Weldtech, incluye 5 piedras de repuesto.",
    price: 3,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/302280076_5435461203210785_8164454640405942617_n.jpg",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Marcador Solido 11/16 Markal Blanco",
    description:
      "Marcador sólido multiuso 11/16 markal blanco (tiza blanca), combina la durabilidad de la pintura con la practicidad de un crayón.",
    price: 2,
    category: "Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/marcador-blanco-markal-11-16.webp",
    brand: "Markal",
    countInStock: 100,
  },
  {
    name: "Careta Electronica fotosensible Jetarco color Negro",
    description:
      "CARETA ELECTRONICA JET-ARCO, fotosensible, con batería de 600mAh y oscurecimiento graduable de 0,1s a 0,8s.",
    price: 40,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/careta-electronica-jetarco-1.webp",
    brand: "JET-ARCO",
    countInStock: 100,
  },
  {
    name: "Antorcha Spool Gun 6M Hoffmanarc ref 404-190 P/Mixen 250pro",
    description:
      "Antorcha Spool Gun 6M Hoffmanarc, referencia 404-190, compatible con Mixen 250pro.",
    price: 700,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/spoolgum-6m-hoffmanarc.webp",
    brand: "Hoffmanarc",
    countInStock: 100,
  },
  {
    name: "Socate de porcelana engomado",
    description: "Socate de porcelana engomado para instalaciones eléctricas.",
    price: 0.5,
    category: "Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/D_NQ_NP_722080-MLV29171109462_012019-O.webp",
    brand: "Sin Marca",
    countInStock: 100,
  },
  {
    name: "Cilindro de Oxigeno tipo 80 Weldtech",
    description:
      "Cilindro de alta presión tipo 80 marca Weldtech, para gases industriales y especiales.",
    price: 90,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/00307CYL-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Hidroneumatico Genpar 80 gal 1 HP",
    description:
      "Hidroneumático Genpar de 80 galones y 1 HP, para un suministro de agua confortable con presión uniforme.",
    price: 665,
    category:
      "Ferretería en General, Herramientas Agrícolas, Hogar y Accesorios, Plomería, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/hidroneumatico-80-galones-1hp-gph-080-100.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Hidroneumatico De 40 Galones 0,5 HP Genpar",
    description:
      "Hidroneumático Genpar de 40 galones y 0.5 HP, ideal para llevar presión a todas las llaves en casas o empresas.",
    price: 430,
    category:
      "Ferretería en General, Herramientas Agrícolas, Hogar y Accesorios, Plomería, Todos los productos, Tuberías",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/hidroneumatico-40-galones-05-hp-gph-040-050.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Manguera morocha de 7 mts (25′) p/ Oxicorte Weldtech",
    description:
      "Manguera para Oxicorte Morocha con conexiones de 7 Mts (25 pies) marca Weldtech.",
    price: 0,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/2102501-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Horno p/ Electrodo de 20 Lbs (9Kgs) Weldtech",
    description:
      "Horno con capacidad para el secado y estabilizado de electrodos para soldar, de 20 Lbs (9Kgs).",
    price: 0,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/2002000-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Horno p/ Electrodo de 10 Lbs (4,5Kgs) Weldtech",
    description:
      "Horno con capacidad para el secado y estabilizado de electrodos para soldar, de 10 Lbs (4,5Kgs).",
    price: 0,
    category: "Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/2002001-T-1024x1024.jpg.webp",
    brand: "Weldtech",
    countInStock: 100,
  },
  {
    name: "Tronzadora 14″ 110v 3800 Rpm 2200w Dewalt D28720-b3",
    description:
      "Modelo D28720-b3. Carcaza de hierro, color amarillo. Potencia de 2200 watts, 3800rpm, 4 hp. Incluye mango ergonómico y prensa de traba para ajuste rápido. Accesorios: Disco de 14″.",
    price: 350,
    category:
      "Abrasivos, Construcción, Ferretería en General, Herramientas Eléctricas, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/11/24262.jpg",
    brand: "Dewalt",
    countInStock: 100,
  },
  {
    name: "Electrobomba periférica 1/2 hp GBP-050A Genpar",
    description:
      "Electrobomba Genpar ideal para aumentar la presión del sistema de acueductos, para la distribución automática de agua por tanques de presión.",
    price: 51,
    category:
      "Ferretería en General, Herramientas Agrícolas, Plomería, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/imagenes-web-electrobomba-periferica-1-2-hp.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Electrobomba periférica 1 hp periférica GBP-100A Genpar",
    description:
      "Electrobomba Genpar ideal para aumentar la presión del sistema de acueductos, para la distribución automática de agua por tanques de presión.",
    price: 80,
    category:
      "Ferretería en General, Herramientas Agrícolas, Plomería, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/imagenes-web-electrobomba-periferica-1hp.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Electrobomba centrífuga 1 hp gbc-100 Genpar",
    description:
      "Electrobomba Centrífuga Genpar ideal para aumentar la presión del sistema de acueductos, para la distribución automática de agua por tanques de presión.",
    price: 186,
    category:
      "Ferretería en General, Herramientas Agrícolas, Plomería, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/electrobomba-doble-etapa-1-hp-300x240-1.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Control Automatico Para Bombas de Agua (PRESS-CONTROL)",
    description:
      "Presscontrol Genpar, un dispositivo para el control de bombas de uso doméstico. Detecta presión y flujo, gestionando automáticamente el funcionamiento de la bomba.",
    price: 38,
    category:
      "Ferretería en General, Hogar y Accesorios, Plomería, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/imagen-nueva-presscontrol.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Motosierra 24″ genpar GCS-055-024",
    description:
      "La motosierra Genpar es una herramienta segura y práctica, ideal para trabajos de jardinería y agroforestales. Espada de 24”, cadena 3/8” Oregon, potencia de 3,3 HP.",
    price: 0,
    category:
      "Ferretería en General, Herramientas Agrícolas, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/motosierra-24-1.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Motosierra 20″ 2T 3HP GCS-054-020 Genpar",
    description:
      "Motosierra Genpar ideal para trabajos de jardinería y agroforestales. Espada de 20”, cadena Oregon 3/8”, motor de 2 Tiempos, potencia de 3 HP.",
    price: 286,
    category:
      "Ferretería en General, Herramientas Agrícolas, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/motosierra-20-1.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Desmalezadora 52cc Gasolina 2T",
    description:
      "Desmalezadora Genpar a Gasolina de 52cc para uso doméstico. Ideal para mantenimiento de setos, jardines y trabajos agroforestales.",
    price: 260,
    category:
      "Herramientas Agrícolas, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/desmalezadora-1-1.jpg",
    brand: "Genpar",
    countInStock: 100,
  },
  {
    name: "Destapador De Cañería S/Rueda Motor 1/3 Hp 20 Metros 16 Milímetros Para TK-50",
    description:
      "Destapador de Cañería 1/3HP 20mts Takima TK-50, aplicable a tuberías de 20-100 mm de grosor. Incluye guayas flexibles y kit de puntas para corte.",
    price: 1120,
    category:
      "Ferretería en General, Herramientas Eléctricas, Plomería, Todos los productos, Tuberías",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/destapador-de-caneria-s-rueda-motor-1-3-hp-20-metr.webp",
    brand: "Takima",
    countInStock: 100,
  },
  {
    name: "Maquina de soldar Lassen 200 Hoffmanarc Ref: 401-101",
    description:
      "Máquina de soldar inversor monofásica de 200 amp, tecnología de control servo automática, frecuencia del inversor de 20 Khz.",
    price: 390,
    category:
      "Construcción, Ferretería en General, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/401-101-1-1024x1024.jpg.webp",
    brand: "Hoffmanarc",
    countInStock: 100,
  },
  {
    name: "Antorcha Plasma S45/ Saw 45 pro Trafimet marca Flammer",
    description:
      "Antorcha de plasma S45 para sistemas de corte por plasma. Compacta, liviana y diseñada para cortes limpios y precisos.",
    price: 120,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/S45-1.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: "Antorcha plasma tipo Esab PT-31/saw 40 pro marca Flammer",
    description:
      "Antorcha de plasma tipo ESAB PT-31, diseño ergonómico para corte de metales conductores. Incluye electrodos, boquillas, casquillos y deflectores.",
    price: 65,
    category: "Consumibles, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/PT-31-2.jpg.webp",
    brand: "Flammer",
    countInStock: 100,
  },
  {
    name: 'Esmeril Angular 4 1/2 " 670 W 12.000 Rpm 5/8" Sin Maletin Ref. Gws670 / 889803 Marca Bosch',
    description:
      "SAG para profesionales con gran potencia de entrada de 670 W. Seguridad máxima con guardas a prueba de explosiones e interruptor de dos movimientos.",
    price: 80,
    category: "Construcción, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/61JyJVvoUCL.jpg",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: "Taladro Reversible Bosch GSB 450W 3/8″",
    description:
      "GSB 450 PROFESSIONAL. TALADRO PERCUTOR ATORNILLADOR. Extremadamente compacto, peso liviano de tan solo 1,2 kg. Velocidad Variable, Giro reversible para apretar tornillos.",
    price: 100,
    category:
      "Construcción, Herramientas Eléctricas, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/6345c2084a5b37c5fbb96330_thumbnail.png",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: 'Taladro Percutor 1/2" 650 W V.V.R 3150 Rpm Ref. Gsb 13 Re Cod. 865669 Marca Bosch',
    description:
      "GSB 13 RE PROFESSIONAL. TALADRO PERCUTOR ATORNILLADOR. Motor de 600 W, práctico con tamaño de un guante de trabajo y solo 1,7 kg de peso. Trabajo pesado con 2 anos de garantía.",
    price: 128,
    category:
      "Construcción, Herramientas Eléctricas, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/TAL-BOS-GSB13RE_b86fe16d-6f8b-4863-b710-0360d23fc9be_800x.webp",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: 'Taladro Percutor 1/2" 800w V.V 3000rpm 48000bpm Caja Ref. Gsb 20-2re Marca Bosch',
    description:
      "GSB 20-2 PROFESSIONAL. TALADRO PERCUTOR ATORNILLADOR. Para trabajos de perforación y atornillado difíciles, caja del engranaje de metal robusto para una larga vida útil.",
    price: 315,
    category: "Construcción, Herramientas Eléctricas, Todos los productos",
    image: "http://supplytechstore.local/wp-content/uploads/2023/11/24063.webp",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: "Lijadora De Palma Orbital 220 W 14000 Rpm 101 Mm X 112mm Gss 14 Marca Bosch",
    description:
      "GSS 140 PROFESSIONAL. LIJADORA ORBITAL. Flexible y sin cansancio para trabajos de larga duración. Excelente diseño ergonómico con vibraciones y peso reducidos.",
    price: 95,
    category: "Construcción, Herramientas Eléctricas, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/LIJ-BOS-GSS140_a6a8cdd3-f45e-4833-8a49-da86c8025a7b_1024x.webp",
    brand: "Bosch",
    countInStock: 100,
  },
  {
    name: "Aspiradora de 12 galones para sólidos y líquidos",
    description:
      "Aspiradora RIDGID® de 12 galones para sólidos y líquidos. Motor de 5,0 HP para limpieza de lugares muy sucios. Tambor de 12 galones para residuos líquidos y desperdicios.",
    price: 275,
    category:
      "Ferretería en General, Herramientas Eléctricas, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/WD1270_L_accs_72dpi.jpg",
    brand: "RIDGID",
    countInStock: 100,
  },
  {
    name: "Fumigadora / Asperjadora De Espalda Manual 20 Litros Ref. Fmb-20 Marca Bellota",
    description:
      "Fumigadora, Aspersora de 20 Litros Bellota. Ideal para fumigar, rociar o asperjar líquidos y agroquímicos para el mantenimiento de cultivos y jardines.",
    price: 75,
    category:
      "Herramientas Agrícolas, Herramientas Manuales, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/FUMIGADORA-DE-ESPALDA-20-lts.-BPLAST.-09-06-0001.png",
    brand: "Bellota",
    countInStock: 100,
  },
  {
    name: "Fumigadora / Asperjadora Manual 5 Lts Vrp Ref. Fci-5 Cod. 207726 Marca Bellota",
    description:
      "Fumigadora / Asperjadora Manual 5 Lts Vrp Ref. Fci-5 Cod. 207726 Marca Bellota. Ideal para aplicaciones de fumigación manual en jardines y pequeñas áreas agrícolas.",
    price: 40,
    category:
      "Herramientas Agrícolas, Herramientas Manuales, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/FUM-BEL-FCI-5_3c8aeb2c-146b-4010-b105-7bc4960c7875_500x.webp",
    brand: "Bellota",
    countInStock: 100,
  },
  {
    name: "Silicón Ultra Rápido SQ Abrillantador Tapicería Lata 354cm3",
    description:
      "Silicón Ultra Rápido SQ, un abrillantador de tapicería en lata de 354cm3, ideal para el cuidado y mantenimiento de interiores de vehículos y muebles.",
    price: 7,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-14-at-6.53.36-AM.jpeg",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Aceite Lubricante En Aerosol SQ 5x1 Lata 354cm3",
    description:
      "Aceite Lubricante en Aerosol 5x1 SQ, protege su inversión con repuestos 100% originales. Universal para diversas aplicaciones de mantenimiento.",
    price: 6,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/D_NQ_NP_820291-MLV44301746039_122020-O.webp",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Formula Mecánica Penetrante SQ 70-6  Lata 354cm3",
    description:
      "SQ 70-6, una fórmula mecánica penetrante que afloja piezas pegadas por óxido y limpia grasa seca. Forma una película protectora lubricante.",
    price: 6,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/IMG_20210714_105600.webp",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Azul Prusia En Spray Sq Lata 354cm3",
    description:
      "Azul de Prusia en Spray SQ, tinta para trazar la preparación de diseños metalmecánicos. Resistente al calor y no desconcharse.",
    price: 13.5,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/D_NQ_NP_658987-MLV54056205102_022023-O.webp",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Limpiador de Motor SQ Lata 440cm3",
    description:
      "Formulado especialmente para lograr una eficaz acción limpiadora que garantiza resultados profesionales, no ataca gomas, correas o mangueras. Es el mas concentrado del mercado ya que no contiene agua. Modo de empleo: aplique sobre el motor apagado y preferiblemente frío, deje actuar unos minutos y enjuague con manguera, su motor quedará como nuevo y sin una mancha de grasa. Usos: para limpieza de todo tipo de motores, desengrasado y limpieza de maquinas y pisos, y recuerda tenemos un producto para cada necesidad.",
    price: 7.5,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/LIM-SQ-LM440CC_9ee34906-9f89-4d0b-b8fb-afecbfffe9bd_500x.webp",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Anti Deslizante para Correas SQ 70-12 Lata de 235cm3",
    description:
      "Es un producto principalmente útil para resolver el problema de las correas que deslizan. Sirve para todo tipo de correas, ya sean de caucho, lona, tejido o cuero. El secamiento es ultra rápido. Úselo en correas de ventiladores de vehículos automotores, en correas expuestas al polvo y condiciones adversas, etc.",
    price: 5,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/D_NQ_NP_756275-MLV52434426782_112022-O.webp",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Limpiador de Cauchos SQ Lata 444 cm3",
    description:
      "El limpiador de cauchos SQ Limpia, da brillo y Protege tus cauchos sin que tengas que trabajar solo rocía y deja que la magia comience, dará color negro brillante a tus cauchos y los protegerá contra los Rayos UV y la Interperie. Recuerda tenemos un producto para cada necesidad.",
    price: 7.8,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/descarga.jpeg",
    brand: "SQ",
    countInStock: 100,
  },
  {
    name: "Restaurador de Cueros y Vinilos 3M 39040 473ml",
    description:
      "Limpia y protege en un solo paso superficies como vinilos, cueros y plásticos dejando un agradable aroma limón. Limpia la suciedad y mugre, mejora la apariencia de las superficies restaurando su brillo natural. Esencia a limón fresco. No contiene abrasivos. Lubrica y deja una capa protectora.",
    price: 18,
    category: "Ferretería en General, Hogar y Accesorios, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/descarga-1.jpeg",
    brand: "3M",
    countInStock: 100,
  },
  {
    name: "Cepillo Manual JAZ VIP 1000 Inoxidable",
    description:
      "Diseño especial que proporciona larga duración y máxima capacidad de arranque. Gran densidad de alambre para mayor presión de cepillado. Núcleo estrecho para facilitar acceso a ranuras. Aplicaciones Sondadura: limpieza y eliminación de cascarilla, óxidos, pinturas y todo tipo de adherencias.",
    price: 20,
    category:
      "Abrasivos, Ferretería en General, Herramientas Manuales, Soldadura y Oxicorte, Todos los productos",
    image:
      "http://supplytechstore.local/wp-content/uploads/2023/11/cepillo-manual-soldador-puas-inoxidables-jaz-vip-1000-inox.jpg",
    brand: "JAZ",
    countInStock: 100,
  },
];
const importProducts = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = await Promise.all(
      productsFromWordpressDatabase.map(async (product) => {
        try {
          return {
            ...product,
            user: adminUser,
          };
        } catch (error) {
          console.error(
            `Error uploading for product ${product.name}: ${error}`
          );
          // Return a default image or modify as needed to ensure required fields are included
          return {
            ...product,
            user: adminUser,
          };
        }
      })
    );

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importProducts();
