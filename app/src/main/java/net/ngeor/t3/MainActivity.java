package net.ngeor.t3;

import android.graphics.Point;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    // bundle key for storing the model
    private static final String BUNDLE_KEY_MODEL = "model";

    // model
    private GameModel model;

    private static GameModel loadModel(Bundle savedInstanceState) {
        GameModel result = null;
        if (savedInstanceState != null) {
            result = (GameModel) savedInstanceState.getSerializable(BUNDLE_KEY_MODEL);
        }

        if (result == null) {
            result = new GameModel(new GameParameters());
        }

        return result;
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private void setModel(GameModel model) {
        if (model == null) {
            throw new IllegalArgumentException();
        }

        this.model = model;
        getBoardView().setModel(model);
        updateHeaderText();

        model.setGameModelListener(new GameModelListener() {
            @Override
            public void stateChanged(GameModel model) {
                updateHeaderText();
                getBoardView().invalidate();

                if (!model.isHumanTurn() && model.getState() == GameState.WaitingPlayer) {
                    cpuThink(model);
                }
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);

        // restore model
        setModel(loadModel(savedInstanceState));

        // create and touch listener
        getBoardView().setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (model.getState() != GameState.WaitingPlayer || !model.isHumanTurn()) {
                    return false;
                }

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    int col = (int) (model.getCols() * event.getX() / v.getWidth());
                    int row = (int) (model.getRows() * event.getY() / v.getHeight());
                    if (model.getState(row, col) == TileState.Empty) {
                        model.play(row, col);
                    }
                }

                return true;
            }
        });

        findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                model.reset();
                getBoardView().invalidate();
            }
        });

        if (model.getState() == GameState.NotStarted) {
            model.start();
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (model == null) {
            outState.remove(BUNDLE_KEY_MODEL);
        } else {
            outState.putSerializable(BUNDLE_KEY_MODEL, model);
        }
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    private void updateHeaderText() {
        int resourceId;

        switch (model.getState()) {
            case Draw:
                resourceId = R.string.state_game_over_draw;
                break;
            case Victory:
                Player winner = model.getTurn();
                if (model.isHuman(winner)) {
                    resourceId = R.string.state_game_over_human_wins;
                } else {
                    resourceId = R.string.state_game_over_cpu_wins;
                }

                break;
            case WaitingPlayer:
                resourceId = model.isHumanTurn() ? R.string.state_waiting_for_human : R.string.state_waiting_for_cpu;
                break;
            case NotStarted:
                resourceId = R.string.state_not_started;
                break;
            default:
                throw new IndexOutOfBoundsException();
        }

        getHeaderView().setText(resourceId);
    }

    private void cpuThink(GameModel model) {
        new AI().execute(model);
    }

    class AI extends AsyncTask<GameModel, Void, Point> {

        @Override
        protected Point doInBackground(GameModel... params) {
            GameModel model = params[0];

            // pause just for effect
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ex) {
            }

            for (int row = 0; row < model.getRows(); row++) {
                for (int col = 0; col < model.getCols(); col++) {
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
            model.play(row, col);
        }
    }
}
