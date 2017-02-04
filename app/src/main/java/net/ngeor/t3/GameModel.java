package net.ngeor.t3;

/**
 * Represents the state of the board.
 * Created by ngeor on 1/29/2017.
 */
public class GameModel extends GameDto {
    // TODO somehow this gets serialized
    // that's why there's the split to GameDto
    private transient GameModelListener gameModelListener = new NullGameModelListener();

    public GameModel(GameParameters gameParameters) {
        super(gameParameters);
    }

    public GameModel(GameDto savedState) {
        super(savedState);
    }

    public void start() {
        setState(GameState.WaitingPlayer);
    }

    @Override
    protected void setState(GameState state) {
        super.setState(state);
        fireStateChanged();
    }

    public void setGameModelListener(GameModelListener gameModelListener) {
        if (gameModelListener == null) {
            throw new IllegalArgumentException();
        }

        this.gameModelListener = gameModelListener;
    }

    private void fireStateChanged() {
        gameModelListener.stateChanged(this);
    }
}
