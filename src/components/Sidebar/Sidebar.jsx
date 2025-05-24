import { useState } from "react";
import { Settings } from "lucide-react";
import BasicConfig from "./BasicConfig";
import DataConfig from "./DataConfig";
import RNNConfig from "./RNNConfig";
import IconButton from "./IconButton";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleToggle = (componentName) => {
    setActiveComponent(prev =>
      prev === componentName ? null : componentName
    );
  };

  const SidebarSection = Object.freeze({
    Basic: "Basic",
    Data: "Data",
    RNN: "RNN",
  });

  return (
    <div className="flex h-screen">

      <div className="bg-white text-gray-700 border-r h-screen flex flex-col items-center w-20">
        <ul>
          <li className="h-16 mb-2 flex justify-center items-center">
            <IconButton onClick={() => handleToggle(SidebarSection.Basic)} icon={Settings} ariaLabel="Abrir menu" />
          </li>
          <li className="h-16 mb-2 flex justify-center items-center">
            <IconButton onClick={() => handleToggle(SidebarSection.Data)} icon={Settings} ariaLabel="Abrir menu" />
          </li>
          <li className="h-16 mb-2 flex justify-center items-center">
            <IconButton onClick={() => handleToggle(SidebarSection.RNN)} icon={Settings} ariaLabel="Abrir menu" />
          </li>
        </ul>
      </div>


      <div
        className={`bg-white text-gray-700 transition-all duration-200 overflow-hidden ${
          activeComponent ? "w-80" : "w-0"
        }`}
      >
        <div className="p-4 text-nowrap">
          {activeComponent === SidebarSection.Basic && <BasicConfig />}
          {activeComponent === SidebarSection.Data && <DataConfig />}
          {activeComponent === SidebarSection.RNN && <RNNConfig />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
