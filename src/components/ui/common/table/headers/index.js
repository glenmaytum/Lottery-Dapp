import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

const TableHeader = ({
  heading,
  requestSort,
  searchCriteria,
  sortIcon,
  width,
}) => {
  return (
    <th
      className={`p-3 text-left min-w-min heightFix cursor-pointer`}
      onClick={() => requestSort(searchCriteria)}
    >
      <span className="flex">
        <BiSortAlt2 className="self-center" />
        {heading}
      </span>
    </th>
  );
};

export default TableHeader;
