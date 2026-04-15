import svgPaths from "./svg-r9q06mzvl4";

function Root1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Root">
      <p className="absolute font-['Fraunces:Bold',sans-serif] font-bold leading-[40px] left-0 text-[#e9d1c2] text-[36px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>{`Memoria Viva `}</p>
    </div>
  );
}

function Root2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Root">
      <p className="absolute font-['Commissioner:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#f6e5cf] text-[14px] top-[-1px] whitespace-nowrap" style={{ fontVariationSettings: "'FLAR' 0, 'VOLM' 0" }}>
        Santa Fé de Antioquia
      </p>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[64px] relative shrink-0 w-[305px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Root1 />
        <Root2 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3b56c872} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pb4beb80} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 15.8333V18.3333" id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Root3() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Root">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#fafafa] text-[16px] top-[-1px] whitespace-nowrap">Cabina</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[#4e7378] h-[48px] relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-[131.063px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
        <Icon />
        <Root3 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1e34ef00} id="Vector" stroke="var(--stroke-0, #0A1D1F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Root4() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Root">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#0a1d1f] text-[16px] top-[-1px] whitespace-nowrap">MaxiLibro</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[33554400px]" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <Icon1 />
          <Root4 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="bg-[#f6e5cf] h-[64px] relative rounded-[33554400px] shrink-0 w-[311.484px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start p-[8px] relative size-full">
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[64px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Link />
      <Navigation />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#28555a] h-[108px] relative shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Header">
      <div className="content-stretch flex flex-col items-start pt-[24px] px-[114.5px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Fraunces:Bold',sans-serif] font-bold leading-[normal] left-[415.59px] text-[#212121] text-[32px] text-center top-0 whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Chismógrafo
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[112px] items-start left-[32px] top-[48px] w-[832px]" data-name="Container">
      <Heading />
      <p className="font-['Bricolage_Grotesque:Medium',sans-serif] font-medium h-[56px] leading-[normal] relative shrink-0 text-[#5d5d5d] text-[18px] text-center w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Comparte tus memorias sobre Santa Fé de Antioquia. Graba tu historia y conviértela en parte del archivo colectivo.
      </p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d={svgPaths.p24642680} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p2a857900} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d="M32 50.6667V58.6667" id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#28555a] content-stretch flex items-center justify-center px-[32px] relative rounded-[33554400px] shrink-0 size-[159px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-[760px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Bricolage_Grotesque:Medium',sans-serif] font-medium leading-[normal] left-[380.44px] text-[#212121] text-[18px] text-center top-0 whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Presiona el botón para comenzar a grabar tu historia
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Paragraph />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#f6e5cf] content-stretch flex flex-col h-[332px] items-center justify-center left-[32px] pb-[4px] pt-[36px] px-[36px] rounded-[16px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] top-[208px] w-[832px]" data-name="Container">
      <Container3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Fraunces:SemiBold',sans-serif] font-semibold leading-[normal] left-0 text-[#212121] text-[20px] top-[-1px] whitespace-nowrap" style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
        Sobre el Chismógrafo
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Bricolage_Grotesque:Regular',sans-serif] font-normal h-[72px] leading-[normal] min-h-px min-w-px relative text-[#5d5d5d] text-[16px]" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
            Este proyecto recopila memorias orales anónimas sobre Santa Fé de Antioquia. Todas las historias pasan por un proceso de moderación automática para asegurar un espacio respetuoso. Las groserías coloquiales son parte de nuestra cultura y están permitidas, siempre que no sean ataques directos.
          </p>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#dfc49f] content-stretch flex flex-col gap-[8px] h-[160px] items-start left-[32px] pb-[2px] pt-[26px] px-[26px] rounded-[10px] top-[572px] w-[832px]" data-name="Container">
      <Heading1 />
      <Frame />
    </div>
  );
}

function Cabina() {
  return (
    <div className="h-[780px] relative shrink-0 w-full" data-name="Cabina">
      <Container1 />
      <Container2 />
      <Container5 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="h-[780px] relative shrink-0 w-full" data-name="Main Content">
      <div className="content-stretch flex flex-col items-start px-[306.5px] relative size-full">
        <Cabina />
      </div>
    </div>
  );
}

function Root() {
  return (
    <div className="bg-[#f6e5cf] content-stretch flex flex-col h-[920px] items-start relative shrink-0 w-full" data-name="Root">
      <Header />
      <MainContent />
    </div>
  );
}

export default function ChismografoAppDevelopment() {
  return (
    <div className="bg-[#f6e5cf] content-stretch flex flex-col items-start relative size-full" data-name="Chismografo app development">
      <Root />
    </div>
  );
}