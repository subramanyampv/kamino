package net.ngeor.t3;

import android.graphics.Point;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    private static final TileState HUMAN_STATE = TileState.X;
    private static final TileState CPU_STATE = TileState.O;

    private final GameModel model = new GameModel();

    private GameState gameState = GameState.WaitingHuman;
    private BoardView boardView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        boardView = (BoardView)findViewById(R.id.board);
        boardView.setModel(model);

        // create and touch listener
        boardView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (gameState != GameState.WaitingHuman) {
                    // ignore event if it's not human's turn
                    return false;
                }

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    int col = (int) (3 * event.getX() / v.getWidth());
                    int row = (int) (3 * event.getY() / v.getHeight());
                    if (model.getState(row, col) == TileState.Empty) {
                        model.setState(row, col, HUMAN_STATE);
                        v.invalidate();
                        humanPlayed();
                    }
                }

                return true;
            }
        });

        findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                gameState = GameState.WaitingHuman;
                model.clear();
                boardView.invalidate();
            }
        });
    }

    interface StateHandler {
        void stateComplete();
    }

    abstract class PlayerPlayedStateHandler implements StateHandler {
        public void stateComplete() {
            TileState winner = model.getWinner();
            if (winner != TileState.Empty) {
                gameState = GameState.Finished;
                ((TextView)findViewById(R.id.header)).setText("Game over! " + winner + " wins!");
            } else if (model.isBoardFull()) {
                gameState = GameState.Finished;
                ((TextView)findViewById(R.id.header)).setText("Game over! Draw!");
            } else {
                waitForOpponent();
            }
        }

        protected abstract void waitForOpponent();
    }

    class HumanPlayedStateHandler extends PlayerPlayedStateHandler {
        @Override
        protected void waitForOpponent() {
            gameState = GameState.WaitingCPU;
            ((TextView)findViewById(R.id.header)).setText("Waiting for CPU...");
            cpuThink();
        }
    }

    class CPUPlayedStateHandler extends PlayerPlayedStateHandler {
        @Override
        protected void waitForOpponent() {
            gameState = GameState.WaitingHuman;
            ((TextView)findViewById(R.id.header)).setText("Waiting for player...");
        }
    }

    private final StateHandler humanPlayedStateHandler = new HumanPlayedStateHandler();
    private final StateHandler cpuPlayedStateHandler = new CPUPlayedStateHandler();

    private void humanPlayed() {
        humanPlayedStateHandler.stateComplete();
    }

    private void cpuPlayed() {
        cpuPlayedStateHandler.stateComplete();
    }

    private void cpuThink() {
        new AI().execute(model);
    }

    class AI extends AsyncTask<GameModel, Void, Point> {

        @Override
        protected Point doInBackground(GameModel... params) {
            GameModel model = params[0];

            for (int row = 0; row < GameModel.ROWS; row++) {
                for (int col = 0; col < GameModel.COLS; col++) {
                    if (model.getState(row, col) == TileState.Empty) {
                        return new Point(col, row);
                    }
                }
            }

            return null;
        }

        @Override
        protected void onPostExecute(Point point) {
            super.onPostExecute(point);
            if (point == null) {
                // TODO: fail
                return;
            }

            int row = point.y;
            int col = point.x;
            model.setState(row, col, CPU_STATE);
            boardView.invalidate();
            cpuPlayed();
        }
    }
}
