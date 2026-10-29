import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface DropdownOptionBase {
  value: string;
  label: ReactNode;
  icon?: IconDefinition;
  disabled?: boolean;
}

interface DropdownAction extends DropdownOptionBase {
  type?: "action";
}

interface DropdownSelectOption extends DropdownOptionBase {
  type: "select";
  checked: boolean;
}

interface DropdownToggleOption extends DropdownOptionBase {
  type: "toggle";
  checked: boolean;
}

type DropdownOption =
  DropdownAction | DropdownSelectOption | DropdownToggleOption;

export type DropdownEntry = DropdownOption | { type: "separator" };

/**
 * Dropdown menu
 *
 * When anything meaningful happens, `onSelect` is called
 *
 * @param trigger - Content rendered inside the trigger button.
 * @param options - Entries and separators to render in the menu.
 * @param onSelect - Called with the `value` of the selected entry.
 */
export const Dropdown = ({
  trigger,
  options,
  onSelect,
}: {
  trigger: ReactNode;
  options: DropdownEntry[];
  onSelect: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Move the menu left when it would go past the right edge of the screen.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;

    menu.style.left = "0";
    menu.style.right = "auto";

    if (menu.getBoundingClientRect().right > window.innerWidth - 8) {
      menu.style.left = "auto";
      menu.style.right = "0";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /** Notify the parent of a selection and close the menu unless it is a toggle. */
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    onSelect(option.value);

    if (option.type !== "toggle") setOpen(false);
  };

  return (
    <div ref={containerRef} className="dropdown">
      <button
        type="button"
        className={`dropdown-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span>{trigger}</span>
        <FontAwesomeIcon icon={faChevronDown} className="dropdown-chevron" />
      </button>

      {open && (
        <div ref={menuRef} className="dropdown-menu">
          {options.map((entry, index) =>
            entry.type === "separator" ? (
              <div key={`separator-${index}`} className="dropdown-separator" />
            ) : (
              <button
                key={entry.value}
                type="button"
                className={`dropdown-item${
                  entry.type === "select" && entry.checked ? " selected" : ""
                }`}
                disabled={entry.disabled}
                onClick={() => handleSelect(entry)}
              >
                {entry.icon && (
                  <span className="dropdown-item-icon">
                    {entry.icon && <FontAwesomeIcon icon={entry.icon} />}
                  </span>
                )}
                <span className="dropdown-item-label">{entry.label}</span>
                {entry.type === "toggle" ? (
                  <span
                    className={`dropdown-switch${entry.checked ? " on" : ""}`}
                  />
                ) : (
                  entry.type === "select" &&
                  entry.checked && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="dropdown-item-check"
                    />
                  )
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};
