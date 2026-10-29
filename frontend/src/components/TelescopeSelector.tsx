import { useQuery } from "@tanstack/react-query";
import { getTelescopes } from "../api/telescope";
import { Dropdown, type DropdownEntry } from "./Dropdown";

export const TelescopeSelector = ({
  telescope,
  setTelescope,
}: {
  telescope: string | null;
  setTelescope: (telescope: string | null) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["telescopes"],
    queryFn: getTelescopes,
    staleTime: "static",
  });

  const selected = data?.find((item) => item.name === telescope);

  const options: DropdownEntry[] = [];

  if (isLoading) {
    options.push({ value: "loading", label: "Загрузка...", disabled: true });
  }

  if (isError) {
    options.push({
      value: "error",
      label: "Ошибка загрузки телескопов",
      disabled: true,
    });
  }

  data?.forEach((item) => {
    options.push({
      type: "select",
      value: item.name,
      label: item.displayName,
      checked: item.name === telescope,
    });
  });

  // options.push(
  //   { type: "separator" },
  //   {
  //     type: "toggle",
  //     value: "save-layouts",
  //     label: "Dummy-toggle",
  //     icon: faFloppyDisk,
  //     checked: false,
  //   },
  //   {
  //     type: "action",
  //     value: "reload-layout",
  //     label: "Dummy-action",
  //     icon: faRotate,
  //     disabled: !telescope,
  //   },
  // );

  // TODO: implement layouts caching in localStorage, layout reloading

  const handleSelect = (value: string) => {
    if (data?.some((item) => item.name === value)) {
      setTelescope(value);
    }
  };

  return (
    <Dropdown
      trigger={
        selected?.displayName ??
        telescope ??
        (isLoading ? "Загрузка..." : "Выберите телескоп")
      }
      options={options}
      onSelect={handleSelect}
    />
  );
};
