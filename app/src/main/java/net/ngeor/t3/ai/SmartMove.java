package net.ngeor.t3.ai;

import net.ngeor.t3.models.*;

import java.util.*;

public class SmartMove extends AbstractMove {
    public SmartMove(GameModel model) {
        super(model);
    }

    List<Location> pickMoves(GameModel model) {
        MinimaxNode startingNode = new MinimaxNode(model, null);
        int bestScore = minimax(startingNode, 2, true);

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
    protected Location pickMove(GameModel model) {
        List<Location> bestMoves = pickMoves(model);

        // in case multiple moves have the same score, pick a random one
        Random random = new Random();
        int nextMoveIndex = random.nextInt(bestMoves.size());
        Location result = bestMoves.get(nextMoveIndex);
        return result;
    }

    private List<Tile> emptyTiles(GameDto model) {
        List<Tile> result = new ArrayList<>();
        for (Tile tile : model.allTiles()) {
            if (tile.isEmpty()) {
                result.add(tile);
            }
        }

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
            HashMap<Tile, Integer> locationFrequency = new HashMap<>();
            List<List<Tile>> winningSequences = new ArrayList<>();
            for (SequenceProvider sequenceProvider : sequenceProviders()) {
                winningSequences.add(sequenceProvider.getSequence());
            }

            for (Tile tile : allTiles()) {
                int frequency = 0;
                for (List<Tile> winningSequence : winningSequences) {
                    if (winningSequence.contains(tile)) {
                        frequency++;
                    }
                }

                locationFrequency.put(tile, frequency);
            }

            for (List<Tile> winningSequence : winningSequences) {
                result = result + scoreOfSequence(winningSequence, locationFrequency);
            }

            return result;
        }

        private int scoreOfSequence(List<Tile> locations, Map<Tile, Integer> locationFrequency) {
            int humanCount = 0;
            int cpuCount = 0;

            for (Tile tile : locations) {
                if (tile.isCpu()) {
                    cpuCount++;
                } else if (tile.isHuman()) {
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
            for (Tile tile : locations) {
                Integer frequency = locationFrequency.get(tile);
                if (frequency == null) {
                    frequency = 0; // should not happen
                }

                if (tile.isCpu()) {
                    result = result + frequency;
                } else if (tile.isHuman()) {
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
            for (Tile tile : emptyTiles(this)) {
                GameDto nextState = new GameDto(this);
                nextState.play(tile.getLocation().getRow(), tile.getLocation().getCol());
                MinimaxNode childNode = new MinimaxNode(nextState, tile.getLocation());
                children.add(childNode);
            }
        }

        public Location getPreviousMove() {
            return previousMove;
        }

        @Override
        public String toString() {
            StringBuilder stringBuilder = new StringBuilder();
            for (int row = 0; row < getRows(); row++) {
                for (int col = 0; col < getCols(); col++) {
                    TileState state = getTile(row, col).getState();
                    String stateAsString = state == TileState.Empty ? " " : state.toString();
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
