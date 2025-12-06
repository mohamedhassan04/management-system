import React from "react";
import { Popover as AntPopover } from "antd";

interface PopoverProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}

const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  width = 200,
}) => {
  return (
    <AntPopover
      trigger="hover"
      placement="bottom"
      styles={{
        body: {
          width: width,
        },
      }}
      content={
        <div>
          <div>{content}</div>
        </div>
      }
    >
      {children}
    </AntPopover>
  );
};

export default Popover;
