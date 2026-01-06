import { Icon } from "@iconify/react";
import React from "react";

const SelectModeButton = () => {
  return (
    <div>
      <select
        name="model"
        id="model"
        className="bg-inherit w-full px-3 py-2.5 bg-neutral-secondary-medium text-heading rounded-base outline-none shadow-xs placeholder:text-body text-primary font-medium"
        defaultValue="think"
      >
        <option value="think">Thinking</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  );
};

export default SelectModeButton;
