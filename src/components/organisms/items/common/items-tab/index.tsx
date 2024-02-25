import TabItem from "@/components/organisms/items/common/items-tab/Item";

const ItemsTab = () => {
  return (
    <div className="text-sm font-medium text-center border-b text-gray-400 border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        <li>
          <TabItem name="NFTs" href="/items/nfts" />
        </li>
        <li>
          <TabItem name="Collections" href="/items/collections" />
        </li>
      </ul>
    </div>
  );
};

export default ItemsTab;
