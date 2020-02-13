import { Role } from './Role'
import { Player } from './Player'
export function countVotes<T extends Role>(voters: T[], getVote: (arg0: T) => Player) {
    // collect votes
    const result = gatherVotes(voters, getVote);
    console.log("vote_result:", { result });
    // process votes
    return processVotes(result);
}
function gatherVotes<T extends Role>(voters: T[], getVote: (arg0: T) => Player) {
    const result: {
        [contactId: number]: {
            player: Player;
            votes: number;
        };
    } = {};
    voters.forEach((voter) => {
        const vote = getVote(voter);
        if (vote) {
            const constactId = vote.contactId;
            if (result[constactId]) {
                result[constactId].votes++;
            } else {
                result[constactId] = {
                    player: vote,
                    votes: 1
                };
            }
        }
    });
    return result;
}
/** counts the votes out */
function processVotes(result: {
    [contactId: number]: {
        player: Player;
        votes: number;
    };
}) {
    if (Object.keys(result).length === 0) {
        return [];
    }
    const highest: {
        players: Player[];
        votes: number;
    } = { players: [], votes: 0 };
    for (let vote in result) {
        const { votes, player } = result[vote];
        if (highest.votes < votes) {
            highest.players = [player];
            highest.votes = votes;
        }
        else if (highest.votes == votes) {
            highest.players.push(player);
        }
    }
    return highest.players;
}
