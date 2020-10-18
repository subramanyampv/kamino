/*
 * MainForm.java
 *
 * Created on 23 ����� 2005, 2:00 ��
 */

package com.ngss.jspidergame;

import java.awt.Rectangle;
import java.awt.event.KeyEvent;

/**
 * @author ngeor
 */
public class MainForm extends javax.swing.JFrame {
    private final Rectangle gamefieldBounds = new Rectangle(0, 40, 640, 480);
    private Game game = new Game();
    private GameComponent gc = new GameComponent(game);
    private long score;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JLabel lblLevel;
    private javax.swing.JLabel lblScore;

    /**
     * Creates new form MainForm.
     */
    @SuppressWarnings("checkstyle:MagicNumber")
    public MainForm() {
        game.addGameEvents(new GameEvents() {
            public void entityCreated(GameEntity ge) {
            }

            public void entityDestroyed(GameEntity ge) {
                if (ge instanceof Enemy) {
                    score += 10;
                    lblScore.setText("Score " + score);
                }
            }

            public void spiderHit() {
            }

            public void aliveChanged(boolean value) {
            }

            public void levelChanged(int value) {
                lblLevel.setText("Level " + value);
            }

        });


        initComponents();

        game.init(game.getLevel() + 1);


        getContentPane().add(gc);
        gc.setBounds(0, 40, 640, 480);
    }

    /**
     * This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("checkstyle:MagicNumber")
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        lblLevel = new javax.swing.JLabel();
        lblScore = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Spider Game");
        addMouseMotionListener(new java.awt.event.MouseMotionAdapter() {
            public void mouseMoved(java.awt.event.MouseEvent evt) {
                formMouseMoved(evt);
            }
        });
        addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                formKeyPressed(evt);
            }
        });
        getContentPane().setLayout(null);

        jPanel1.setBackground(new java.awt.Color(0, 0, 92));
        jPanel1.setLayout(null);

        lblLevel.setFont(new java.awt.Font("Impact", 0, 18));
        lblLevel.setForeground(new java.awt.Color(255, 255, 102));
        lblLevel.setText("Level");
        jPanel1.add(lblLevel);
        lblLevel.setBounds(10, 10, 150, 23);

        lblScore.setFont(new java.awt.Font("Impact", 0, 18));
        lblScore.setForeground(new java.awt.Color(255, 255, 102));
        lblScore.setText("Score");
        jPanel1.add(lblScore);
        lblScore.setBounds(170, 10, 150, 23);

        getContentPane().add(jPanel1);
        jPanel1.setBounds(0, 0, 640, 40);

        java.awt.Dimension screenSize = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
        setBounds((screenSize.width - 640) / 2, (screenSize.height - 555) / 2, 640, 555);
    }

    private void formKeyPressed(java.awt.event.KeyEvent evt) {
        if (evt.getKeyCode() == KeyEvent.VK_LEFT) {
            gc.moveLeft();
        } else if (evt.getKeyCode() == KeyEvent.VK_RIGHT) {
            gc.moveRight();
        } else if (evt.getKeyCode() == KeyEvent.VK_SPACE) {
            gc.fire();
        } else if (evt.getKeyCode() == KeyEvent.VK_S) {
            gc.togglePause();
        }
    }

    private void formMouseMoved(java.awt.event.MouseEvent evt) {
        gc.moveAt(evt.getX());
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new MainForm().setVisible(true);
            }
        });
    }
}