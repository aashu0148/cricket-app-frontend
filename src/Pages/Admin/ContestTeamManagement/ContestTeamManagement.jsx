import React, { useState } from "react";
import { toast } from "react-hot-toast";

import PageLoader from "@/Components/PageLoader/PageLoader";
import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import Spinner from "@/Components/Spinner/Spinner";
import PlayerSmallCard from "@/Components/PlayerSmallCard/PlayerSmallCard";
import Modal from "@/Components/Modal/Modal";

import {
  getContestById,
  adminAddPlayerToTeam,
  adminRemovePlayerFromTeam,
} from "@/apis/contests";
import { searchPlayerByName } from "@/apis/players";

const ContestTeamManagement = () => {
  const [contestId, setContestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingContest, setFetchingContest] = useState(false);
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchingPlayer, setSearchingPlayer] = useState(false);
  const [playerResults, setPlayerResults] = useState([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleFetchContest = async () => {
    if (!contestId.trim()) {
      toast.error("Please enter a contest ID");
      return;
    }

    setFetchingContest(true);
    const res = await getContestById(contestId);
    setFetchingContest(false);

    if (!res) return;

    setLeagueDetails(res.data);
    toast.success("Contest details fetched successfully");
  };

  const handleSearchPlayer = async () => {
    if (!searchPlayer.trim()) return;

    setPlayerResults([]);
    setSearchingPlayer(true);
    const res = await searchPlayerByName(searchPlayer);
    setSearchingPlayer(false);

    if (!res) return;

    const players = res.data.map((p) => {
      delete p.stats;
      return p;
    });

    // Filter out players already in teams
    const availablePlayers = players.filter((player) => {
      if (!leagueDetails) return true;

      return !leagueDetails.teams.some((team) =>
        team.players.some((teamPlayer) => teamPlayer._id === player._id)
      );
    });

    setPlayerResults(availablePlayers);
  };

  const handleAddPlayerToTeam = async (teamId, player) => {
    if (!leagueDetails) return;

    setLoading(true);
    const payload = {
      leagueId: leagueDetails._id,
      teamId,
      playerId: player._id,
    };

    const res = await adminAddPlayerToTeam(payload);
    setLoading(false);

    if (!res) return;

    // Update local state
    setLeagueDetails((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        teams: prev.teams.map((team) =>
          team._id === teamId
            ? { ...team, players: [...team.players, player] }
            : team
        ),
      };
    });

    toast.success("Player added to team successfully");
    setShowAddPlayerModal(false);
    setSelectedTeam("");
  };

  const handleRemovePlayerFromTeam = async (teamId, playerId) => {
    if (!leagueDetails) return;

    setLoading(true);
    const payload = {
      leagueId: leagueDetails._id,
      teamId,
      playerId,
    };

    const res = await adminRemovePlayerFromTeam(payload);
    setLoading(false);

    if (!res) return;

    // Update local state
    setLeagueDetails((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        teams: prev.teams.map((team) =>
          team._id === teamId
            ? {
                ...team,
                players: team.players.filter((p) => p._id !== playerId),
              }
            : team
        ),
      };
    });

    toast.success("Player removed from team successfully");
  };

  const openAddPlayerModal = (teamId) => {
    setSelectedTeam(teamId);
    setShowAddPlayerModal(true);
  };

  const getAvailablePlayers = () => {
    if (!leagueDetails) return [];

    return playerResults.filter((player) => {
      // Check if player is not already in any team
      return !leagueDetails.teams.some((team) =>
        team.players.some((teamPlayer) => teamPlayer._id === player._id)
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Contest Team Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage teams and players in contests
          </p>
        </div>

        {/* Contest ID Input */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <InputControl
                label="Contest ID"
                placeholder="Enter contest ID"
                value={contestId}
                onChange={(e) => setContestId(e.target.value)}
              />
            </div>
            <Button
              onClick={handleFetchContest}
              disabled={fetchingContest}
              useSpinnerWhenDisabled
            >
              {fetchingContest ? "Fetching..." : "Fetch Contest"}
            </Button>
          </div>
        </div>

        {fetchingContest && <PageLoader />}

        {leagueDetails && (
          <>
            {/* Contest Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {leagueDetails.name}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                    Tournament
                  </label>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {leagueDetails.tournament.longName}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    Type
                  </label>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {leagueDetails.type}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                    Teams
                  </label>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {leagueDetails.teams.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Teams and Players */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Teams and Players
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {leagueDetails.teams.map((team) => (
                  <div
                    key={team._id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {team.name || `${team.owner.name}'s Team`}
                      </h3>
                      <Button
                        small
                        onClick={() => openAddPlayerModal(team._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add Player
                      </Button>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Owner
                      </label>
                      <p className="text-gray-900 font-medium text-lg mt-1">
                        {team.owner.name}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Players ({team.players.length})
                        </label>
                      </div>

                      {team.players.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-4xl mb-2">⚽</div>
                          <p className="text-gray-500 font-medium">
                            No players added yet
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                          {team.players.map((player) => (
                            <PlayerManagementCard
                              key={player._id}
                              player={player}
                              onRemove={() =>
                                handleRemovePlayerFromTeam(team._id, player._id)
                              }
                              showRemoveButton={true}
                              loading={loading}
                              removeButtonText="Remove Player"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Add Player Modal */}
        {showAddPlayerModal && (
          <Modal
            onClose={() => {
              setShowAddPlayerModal(false);
              setSelectedTeam("");
              setSearchPlayer("");
              setPlayerResults([]);
            }}
          >
            <div className="p-5 w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Add Player to Team
                </h2>
                <p className="text-gray-600">
                  Search and select a player to add to the team
                </p>
              </div>

              <div className="mb-8">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <InputControl
                      placeholder="Search player by name"
                      value={searchPlayer}
                      onChange={(e) => setSearchPlayer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchPlayer();
                      }}
                      icon={
                        searchingPlayer ? <Spinner small white noMargin /> : ""
                      }
                    />
                  </div>
                  <Button
                    onClick={handleSearchPlayer}
                    disabled={searchingPlayer}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Search
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  {getAvailablePlayers().length > 0 ? (
                    <div className="space-y-4">
                      {getAvailablePlayers().map((player) => (
                        <PlayerManagementCard
                          key={player._id}
                          player={player}
                          onAdd={() =>
                            handleAddPlayerToTeam(selectedTeam, player)
                          }
                          showAddButton={true}
                          loading={loading}
                          addButtonText="Add to Team"
                        />
                      ))}
                    </div>
                  ) : playerResults.length > 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">🔍</div>
                      <p className="text-gray-500 font-medium text-lg">
                        No available players found
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        All players are already assigned to teams
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">👥</div>
                      <p className="text-gray-500 font-medium text-lg">
                        Search for players to add
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Enter a player name and click search
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  cancelButton
                  onClick={() => {
                    setShowAddPlayerModal(false);
                    setSelectedTeam("");
                    setSearchPlayer("");
                    setPlayerResults([]);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Reusable Player Management Component
const PlayerManagementCard = ({
  player,
  onRemove,
  onAdd,
  showAddButton = false,
  showRemoveButton = false,
  loading = false,
  addButtonText = "Add to Team",
  removeButtonText = "Remove Player",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <PlayerSmallCard
        playerData={player}
        showCountry
        hideScore
        onDeleteClick={() => {}}
        onHideBreakdown={() => {}}
        onShowBreakdown={() => {}}
        bottomJSX={<></>}
        squadData={{}}
        showDeleteIcon={false}
        isDeleting={false}
      />

      <div className="mt-3 flex gap-2">
        {showAddButton && (
          <Button
            small
            onClick={onAdd}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {addButtonText}
          </Button>
        )}

        {showRemoveButton && (
          <Button
            small
            outlineButton
            onClick={onRemove}
            disabled={loading}
            className="flex-1 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          >
            {removeButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContestTeamManagement;
