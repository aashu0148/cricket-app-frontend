import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";

import { CONTEST_PAGE_TABS, CONTEST_PAGE_TABS_LIST } from "./utils/constants";
import { useContest } from "./utils/context";

function ContestTabs() {
  const { activeTab, setActiveTab, isDraftRoundCompleted } = useContest();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as CONTEST_PAGE_TABS)}
      className="w-fit min-w-[300px]"
    >
      <TabsList className="flex items-center h-11">
        {CONTEST_PAGE_TABS_LIST.filter((e) =>
          !isDraftRoundCompleted && e === CONTEST_PAGE_TABS.MATCHES
            ? false
            : true
        ).map((label) => (
          <TabsTrigger
            className={`flex-1 !shadow-none p-2 ${
              activeTab === label ? "!bg-primary !text-white" : ""
            }`}
            key={label}
            value={label}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default ContestTabs;
