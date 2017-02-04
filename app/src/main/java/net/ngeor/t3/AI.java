package net.ngeor.t3;

import android.os.AsyncTask;

import java.util.*;

class BoardCoordinates {
    private final int row;
    private final int col;

    public BoardCoordinates(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    @Override
    public String toString() {
        return "row=" + row +
                ", col=" + col;
    }
}

public abstract class AI extends AsyncTask<Void, Void, BoardCoordinates> {
    private final GameModel model;

    public AI(GameModel model) {
        this.model = model;
    }

    @Override
    protected BoardCoordinates doInBackground(Void... params) {
        // pause just for effect
        try {
            Thread.sleep(500);
        } catch (InterruptedException ex) {
        }


        return select(model);
    }

    @Override
    protected void onPostExecute(BoardCoordinates point) {
        super.onPostExecute(point);
        if (point == null) {
            // TODO: fail
            return;
        }

        int row = point.getRow();
        int col = point.getCol();
        model.play(row, col);
    }

    protected abstract BoardCoordinates select(GameModel model);
}

class FirstBlankAI extends AI {

    public FirstBlankAI(GameModel model) {
        super(model);
    }

    @Override
    protected BoardCoordinates select(GameModel model) {
        for (int row = 0; row < model.getRows(); row++) {
            for (int col = 0; col < model.getCols(); col++) {
                if (model.getState(row, col) == TileState.Empty) {
                    return new BoardCoordinates(row, col);
                }
            }
        }

        return null;
    }
}

class RandomAI extends AI {
    public RandomAI(GameModel model) {
        super(model);
    }

    @Override
    protected BoardCoordinates select(GameModel model) {
        Random random = new Random();
        boolean found = false;
        int row = -1;
        int col = -1;
        while (!found) {
            row = random.nextInt(model.getRows());
            col = random.nextInt(model.getCols());
            found = model.getState(row, col) == TileState.Empty;
        }

        return new BoardCoordinates(row, col);
    }
}

class SmartAI extends AI {
    public SmartAI(GameModel model) {
        super(model);
    }

    @Override
    protected BoardCoordinates select(GameModel model) {
        Node startingNode = new Node(model);
        startingNode.expandFully();
        List<Transition> children = startingNode.transitions;
        Collections.sort(children, new Comparator<Transition>() {
            @Override
            public int compare(Transition o1, Transition o2) {
                if (o1.futureNode.score > o2.futureNode.score) {
                    return -1;
                } else if (o1.futureNode.score < o2.futureNode.score) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });


        return children.get(0).tileToPlay;
    }

    private List<BoardCoordinates> emptyTiles(GameDto model) {
        List<BoardCoordinates> result = new ArrayList<>();
        for (int row = 0; row < model.getRows(); row++) {
            for (int col = 0; col < model.getCols(); col++) {
                if (model.getState(row, col) == TileState.Empty) {
                    result.add(new BoardCoordinates(row, col));
                }
            }
        }

        return result;
    }

    class Node {
        private GameDto originalState;
        private List<Transition> transitions;

        public Node(GameDto originalState) {
            this.originalState = new GameDto(originalState);
        }

        private void ensureTransitions() {
            if (transitions != null) {
                return;
            }

            transitions = new ArrayList<>();

            for (BoardCoordinates boardCoordinates : emptyTiles(originalState)) {
                transitions.add(new Transition(originalState, boardCoordinates));
            }
        }

        public List<Node> getChildren() {
            ensureTransitions();
            List<Node> result = new ArrayList<>();
            for (Transition transition : transitions) {
                result.add(transition.getDestination());
            }

            return result;
        }

        public void expandFully() {
            ensureTransitions();
            List<Node> children = getChildren();
            for (Node child : children) {
                child.expandFully();
            }

            if (originalState.getState() == GameState.Victory) {
                if (originalState.isHumanTurn()) {
                    score = -10;
                } else {
                    score = 10;
                }
            } else if (children.size() > 0) {
                score = 0;

                for (Node child : children) {
                    score = score + child.score;
                }

                score = score / children.size();
            }
        }

        private float score;
    }

    class Transition {
        private BoardCoordinates tileToPlay;
        private Node futureNode;

        public Transition(GameDto originalState, BoardCoordinates tileToPlay) {
            this.tileToPlay = tileToPlay;
            GameDto futureState = new GameDto(originalState);
            futureState.play(tileToPlay.getRow(), tileToPlay.getCol());
            futureNode = new Node(futureState);
        }

        public Node getDestination() {
            return futureNode;
        }
    }
}
