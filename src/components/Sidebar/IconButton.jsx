const IconButton = ({ onClick, icon: Icon}) => {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-md focus:text-primary focus:bg-secundary  hover:bg-gray-100"
    >
      <Icon />
    </button>
  );
};

export default IconButton;