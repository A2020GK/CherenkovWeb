import { TelescopeSelector } from "./TelescopeSelector";

export const Header = ({
  telescope,
  setTelescope,
}: {
  telescope: string | null;
  setTelescope: (telescope: string | null) => void;
}) => (
  <header>
    <TelescopeSelector telescope={telescope} setTelescope={setTelescope} />
  </header>
);
