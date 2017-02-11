package net.ngeor.t3.ai;

import net.ngeor.t3.models.*;

import java.util.*;

public class SmartMove extends AbstractMove {
    private final PlayerSymbol me;
    private final int minimaxDepth;

    public SmartMove(GameDto model, int minimaxDepth) {
        super(model);
        this.me = model.getTurn();
        this.minimaxDepth = minimaxDepth;
    }

    List<Location> pickMoves(GameDto model) {
        MinimaxNode startingNode = new MinimaxNode(model, null);
        int bestScore = minimax(startingNode, minimaxDepth, true);

        // collect matching nodes
        List<MinimaxNode> bestMoves = new ArrayList<>();
        for (MinimaxNode child : startingNode.children()) {
            if (child.getScore() == bestScore) {
                bestMoves.add(child);
            }
        }

        // make sure we have at least one move
        if (bestMoves.isEmpty()) {
            bestMoves.add(startingNode.children().get(0));
        }

        List<Location> result = new ArrayList<>();
        for (MinimaxNode node : bestMoves) {
            result.add(node.getPreviousMove());
        }

        return result;
    }

    @Override
    protected Location pickMove(GameDto model) {
        List<Location> bestMoves = pickMoves(model);

        // in case multiple moves have the same score, pick a random one
        Random random = new Random();
        int nextMoveIndex = random.nextInt(bestMoves.size());
        Location result = bestMoves.get(nextMoveIndex);
        return result;
    }

    private int minimax(MinimaxNode node, int depth, boolean maximizingPlayer) {
        int bestValue;

        if (depth == 0 || node.isTerminal()) {
            bestValue = node.heuristic();
        } else {
            int v;
            if (maximizingPlayer) {
                bestValue = Integer.MIN_VALUE;
                for (MinimaxNode child : node.children()) {
                    v = minimax(child, depth - 1, false);
                    bestValue = Math.max(bestValue, v);
                }

            } else {
                bestValue = Integer.MAX_VALUE;
                for (MinimaxNode child : node.children()) {
                    v = minimax(child, depth - 1, true);
                    bestValue = Math.min(bestValue, v);
                }
            }
        }

        node.setScore(bestValue);
        return bestValue;
    }

    class MinimaxNode extends GameDto {
        private List<MinimaxNode> children;
        private int score;
        private final Location previousMove;

        public MinimaxNode(GameDto currentState, Location previousMove) {
            super(currentState);
            this.previousMove = previousMove;
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
            List<List<Location>> winningSequences = new ArrayList<>();
            for (SequenceProvider sequenceProvider : getBoardModel().winningSequenceProviders()) {
                winningSequences.add(sequenceProvider.getSequence());
            }

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

        private int scoreOfSequence(List<Location> locations, Map<Location, Integer> locationFrequency) {
            int humanCount = 0;
            int cpuCount = 0;

            for (Location location : locations) {
                PlayerSymbol playerAtLocation = getBoardModel().getPlayerSymbol(location);

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

                PlayerSymbol playerAtLocation = getBoardModel().getPlayerSymbol(location);
                if (playerAtLocation == me) {
                    result = result + frequency;
                } else if (playerAtLocation == me.opponent()) {
                    result = result - frequency;
                }
            }

            return result;
        }

        public List<MinimaxNode> children() {
            populateChildren();
            return children;
        }

        public boolean isTerminal() {
            populateChildren();
            return children.size() <= 0;
        }

        private void populateChildren() {
            if (children != null) {
                return;
            }

            children = new ArrayList<>();
            for (Location location : getBoardModel().emptyLocations()) {
                GameDto nextState = new GameDto(this);
                nextState.play(location.getRow(), location.getCol());
                MinimaxNode childNode = new MinimaxNode(nextState, location);
                children.add(childNode);
            }
        }

        public Location getPreviousMove() {
            return previousMove;
        }

        @Override
        public String toString() {
            StringBuilder stringBuilder = new StringBuilder();
            for (int row = 0; row < getBoardModel().getRows(); row++) {
                for (int col = 0; col < getBoardModel().getCols(); col++) {
                    TileState state = getBoardModel().getTileState(row, col);
                    String stateAsString = state == TileState.EMPTY ? " " : state.toString();
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
    }
}
