package net.ngeor.t3.ai;

import net.ngeor.t3.models.BoardModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.ImmutableGameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.models.WinningSequencesProvider;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MinimaxNode {
    private final ImmutableGameModel currentState;
    private final Location previousMove;
    private final PlayerSymbol me;
    private List<MinimaxNode> children;
    private int score;

    public MinimaxNode(ImmutableGameModel currentState, Location previousMove, PlayerSymbol me) {
        this.currentState = currentState;
        this.previousMove = previousMove;
        this.me = me;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int heuristic() {
        int result = 0;

        // calculate the winning frequency of a location
        // e.g. top-left corner frequency is 3, because it appears in
        // 3 different possible combinations
        HashMap<Location, Integer> locationFrequency = new HashMap<>();
        List<List<Location>> winningSequences = new WinningSequencesProvider().calculate(getBoardModel());

        for (Location location : getBoardModel().allLocations()) {
            int frequency = 0;
            for (List<Location> winningSequence : winningSequences) {
                if (winningSequence.contains(location)) {
                    frequency++;
                }
            }

            locationFrequency.put(location, frequency);
        }

        for (List<Location> winningSequence : winningSequences) {
            result = result + scoreOfSequence(winningSequence, locationFrequency);
        }

        return result;
    }

    public List<MinimaxNode> children() {
        populateChildren();
        return children;
    }

    public boolean isTerminal() {
        populateChildren();
        return children.isEmpty();
    }

    public Location getPreviousMove() {
        return previousMove;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int row = 0; row < getBoardModel().getRows(); row++) {
            for (int col = 0; col < getBoardModel().getCols(); col++) {
                PlayerSymbol state = getBoardModel().getTileState(row, col);
                String stateAsString = state == null ? " " : state.toString();
                stringBuilder.append(stateAsString);
            }

            stringBuilder.append("\r\n");
        }

        return "MinimaxNode{" +
                stringBuilder.toString() +
                " score=" + score +
                ", previousMove=" + previousMove +
                '}';
    }

    private BoardModel getBoardModel() {
        return currentState.getBoardModel();
    }

    private int scoreOfSequence(List<Location> locations, Map<Location, Integer> locationFrequency) {
        int humanCount = 0;
        int cpuCount = 0;

        for (Location location : locations) {
            PlayerSymbol playerAtLocation = getBoardModel().getTileState(location);

            if (playerAtLocation == me) {
                cpuCount++;
            } else if (playerAtLocation == me.opponent()) {
                humanCount++;
            }
        }

        // TODO calculate an appropriate high value
        final int VICTORY = 42;

        if (cpuCount == locations.size()) {
            // victory
            return VICTORY;
        }

        if (humanCount == locations.size()) {
            // defeat
            return -VICTORY;
        }

        int result = 0;
        for (Location location : locations) {
            Integer frequency = locationFrequency.get(location);
            if (frequency == null) {
                frequency = 0; // should not happen
            }

            PlayerSymbol playerAtLocation = getBoardModel().getTileState(location);
            if (playerAtLocation == me) {
                result = result + frequency;
            } else if (playerAtLocation == me.opponent()) {
                result = result - frequency;
            }
        }

        return result;
    }

    private void populateChildren() {
        if (children != null) {
            return;
        }

        children = new ArrayList<>();
        if (currentState.getState() != GameState.WaitingPlayer) {
            // victory or draw, no pointing playing further
            return;
        }

        for (Location location : getBoardModel().emptyLocations()) {
            ImmutableGameModel nextState = currentState.immutablePlay(location.getRow(), location.getCol());
            MinimaxNode childNode = new MinimaxNode(nextState, location, me);
            children.add(childNode);
        }
    }
}
