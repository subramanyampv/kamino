package net.ngeor.t3.ai;

import net.ngeor.t3.models.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SmartMove extends AbstractMove {
    public SmartMove(GameModel model) {
        super(model);
    }

    List<Location> pickMoves(GameModel model) {
        MinimaxNode startingNode = new MinimaxNode(model, null);
        int bestScore = minimax(startingNode, 3, true);

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

    private List<Location> emptyTiles(GameDto model) {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < model.getRows(); row++) {
            for (int col = 0; col < model.getCols(); col++) {
                if (model.getState(row, col) == TileState.Empty) {
                    result.add(new Location(row, col));
                }
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

            for (SequenceProvider sequenceProvider : sequenceProviders()) {
                List<TileState> sequence = sequenceProvider.getSequence();
                result = result + scoreOfSequence(sequence);
            }

            return result;
        }

        private int scoreOfSequence(List<TileState> tiles) {
            int emptyCount = 0;
            int humanCount = 0;
            int cpuCount = 0;

            for (TileState tile : tiles) {
                if (tile == TileState.Empty) {
                    emptyCount++;
                } else if (tile == getCpuTileState()) {
                    cpuCount++;
                } else {
                    humanCount++;
                }
            }

            if (cpuCount == tiles.size()) {
                // victory
                return 10;
            }

            if (humanCount == tiles.size()) {
                // defeat
                return -10;
            }

            if (cpuCount > 0) {
                return cpuCount + emptyCount - humanCount;
            } else if (humanCount > 0) {
                return  cpuCount - humanCount - emptyCount;
            } else {
                return emptyCount;
            }
        }

        private TileState getCpuTileState() {
            return TileState.fromPlayer(getGameParameters().getHumanPlayer().opponent());
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
            List<Location> emptyTiles = emptyTiles(this);
            for (Location location : emptyTiles) {
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
            for (int row = 0; row < getRows(); row++) {
                for (int col = 0; col < getCols(); col++) {
                    TileState state = getState(row, col);
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
