import { useState, useRef, useEffect } from "react";
import { DEVICE_STATUS, DeviceStatusValue } from "../constants/device";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface FilterDropdownProps {
  value: DeviceStatusValue;
  onChange: (value: DeviceStatusValue) => void;
}

const FilterDropdown = ({ value, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: DEVICE_STATUS.ALL, label: "All Devices" },
    { value: DEVICE_STATUS.ACTIVE, label: "Active Devices" },
    { value: DEVICE_STATUS.INACTIVE, label: "Inactive Devices" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} data-testid="filter-dropdown">
      <button
        data-testid="filter-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
      >
        <span>{options.find((opt) => opt.value === value)?.label}</span>
        <ChevronDownIcon
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                data-testid={`filter-option-${option.value}`}
                onClick={() => {
                  onChange(option.value as DeviceStatusValue);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                  value === option.value
                    ? "text-primary font-medium bg-primary/5"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
