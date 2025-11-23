import type { Metadata } from "next";
import { 
  Inter, 
  Roboto, 
  Open_Sans, 
  Montserrat, 
  Poppins, 
  Lato, 
  Oswald, 
  Raleway, 
  PT_Sans, 
  Merriweather, 
  Nunito, 
  Ubuntu, 
  Playfair_Display, 
  Work_Sans, 
  Bebas_Neue,
  Dancing_Script,
  Pacifico,
  Permanent_Marker,
  Lobster,
  Righteous,
  Bangers,
  Russo_One,
  Inconsolata,
  Fira_Code,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  IBM_Plex_Sans_Condensed
} from "next/font/google";
import "./globals.css";

// IBM Plex Sans Condensed - Default font
const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({ weight: ['400', '500', '600', '700'], subsets: ["latin"], variable: '--font-ibm-plex-sans-condensed' });

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const roboto = Roboto({ weight: ['400', '500', '700', '900'], subsets: ["latin"], variable: '--font-roboto' });
const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-open-sans' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const poppins = Poppins({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ["latin"], variable: '--font-poppins' });
const lato = Lato({ weight: ['400', '700', '900'], subsets: ["latin"], variable: '--font-lato' });
const oswald = Oswald({ subsets: ["latin"], variable: '--font-oswald' });
const raleway = Raleway({ subsets: ["latin"], variable: '--font-raleway' });
const ptSans = PT_Sans({ weight: ['400', '700'], subsets: ["latin"], variable: '--font-pt-sans' });
const merriweather = Merriweather({ weight: ['400', '700', '900'], subsets: ["latin"], variable: '--font-merriweather' });
const nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' });
const ubuntu = Ubuntu({ weight: ['400', '500', '700'], subsets: ["latin"], variable: '--font-ubuntu' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const workSans = Work_Sans({ subsets: ["latin"], variable: '--font-work-sans' });
const bebasNeue = Bebas_Neue({ weight: ['400'], subsets: ["latin"], variable: '--font-bebas-neue' });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: '--font-dancing-script' });
const pacifico = Pacifico({ weight: ['400'], subsets: ["latin"], variable: '--font-pacifico' });
const permanentMarker = Permanent_Marker({ weight: ['400'], subsets: ["latin"], variable: '--font-permanent-marker' });
const lobster = Lobster({ weight: ['400'], subsets: ["latin"], variable: '--font-lobster' });
const righteous = Righteous({ weight: ['400'], subsets: ["latin"], variable: '--font-righteous' });
const bangers = Bangers({ weight: ['400'], subsets: ["latin"], variable: '--font-bangers' });
const russoOne = Russo_One({ weight: ['400'], subsets: ["latin"], variable: '--font-russo-one' });
const inconsolata = Inconsolata({ subsets: ["latin"], variable: '--font-inconsolata' });
const firaCode = Fira_Code({ subsets: ["latin"], variable: '--font-fira-code' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-plus-jakarta-sans' });

export const metadata: Metadata = {
  title: "DesainCepat - Thumbnail Generator",
  description: "Buat thumbnail berkualitas dengan cepat dan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body 
        className={`
          ${ibmPlexSansCondensed.variable}
          ${inter.variable} 
          ${roboto.variable} 
          ${openSans.variable} 
          ${montserrat.variable} 
          ${poppins.variable} 
          ${lato.variable} 
          ${oswald.variable} 
          ${raleway.variable} 
          ${ptSans.variable} 
          ${merriweather.variable} 
          ${nunito.variable} 
          ${ubuntu.variable} 
          ${playfair.variable} 
          ${workSans.variable} 
          ${bebasNeue.variable}
          ${dancingScript.variable}
          ${pacifico.variable}
          ${permanentMarker.variable}
          ${lobster.variable}
          ${righteous.variable}
          ${bangers.variable}
          ${russoOne.variable}
          ${inconsolata.variable}
          ${firaCode.variable}
          ${jetbrainsMono.variable}
          ${plusJakartaSans.variable}
          ${ibmPlexSansCondensed.className}
        `}
      >
        {children}
      </body>
    </html>
  );
}
