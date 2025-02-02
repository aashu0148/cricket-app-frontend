import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";

import { shareContest } from "@/utils/util";
import { useContest } from "./utils/context";

function ShareContest({ onClose }) {
  const { tournamentDetails, contestDetails } = useContest();

  const handleShare = async () => {
    try {
      shareContest({
        tid: tournamentDetails._id,
        contestId: contestDetails._id,
        ownerName:
          typeof contestDetails.createdBy === "string"
            ? ""
            : contestDetails.createdBy?.name,
        password: contestDetails.password,
      });

      onClose();
    } catch (err) {
      console.error("Failed to share contest:", err);
    }
  };

  return (
    <Modal
      title={""}
      doNotAnimate={false}
      noTopPadding={false}
      styleToInner={null}
      className="text-center"
      onClose={onClose}
    >
      <div className="w-[500px] max-w-full p-6">
        <div className="text-8xl mb-8">🎊</div>

        <h2 className="text-2xl font-medium mb-6">Share with Friends</h2>
        <p className="mb-8 text-gray-700">
          Invite your friends to join this exciting cricket fantasy contest!
        </p>

        <Button onClick={handleShare} className="w-full mx-auto" gradientButton>
          Copy share message
        </Button>
      </div>
    </Modal>
  );
}

export default ShareContest;
